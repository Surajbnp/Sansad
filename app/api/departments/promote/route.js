export const dynamic = "force-dynamic";

// app/api/departments/promote/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import DepartmentModel from "@/models/Department.model";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await database();

    const admin = await UserModel.findById(decoded.id);
    if (!admin || admin.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can promote departments" },
        { status: 403 },
      );
    }

    /* ── 2. body ── */
    const { departmentId, otp } = await req.json();

    if (!departmentId || !otp) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    /* ── 3. verify OTP locally using the stored SMS OTP ── */
    const otpRecord = await Otp.findOne({ email: admin.phone });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "OTP expired or not found. Please resend." },
        { status: 400 },
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email: admin.phone });
      return NextResponse.json(
        { success: false, message: "OTP expired or not found. Please resend." },
        { status: 400 },
      );
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== otpRecord.otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP. Please try again." },
        { status: 400 },
      );
    }

    /* ── 4. find department ── */
    const department = await DepartmentModel.findById(departmentId);
    if (!department) {
      return NextResponse.json(
        { success: false, message: "Department not found" },
        { status: 404 },
      );
    }

    /* ── 5. find the department's assigned user ── */
    const deptUser = await UserModel.findById(department.assignedUser);
    if (!deptUser) {
      return NextResponse.json(
        { success: false, message: "Assigned user not found" },
        { status: 404 },
      );
    }

    /* ── 6. guard: already an admin? ── */
    if (deptUser.role === "Admin") {
      return NextResponse.json(
        { success: false, message: "User is already an Admin" },
        { status: 409 },
      );
    }

    /* ── 7. promote user & delete department in parallel ── */
    await Promise.all([
      UserModel.findByIdAndUpdate(deptUser._id, { role: "Admin" }),
      DepartmentModel.findByIdAndDelete(department._id),
    ]);

    await Otp.deleteOne({ email: admin.phone });

    return NextResponse.json(
      {
        success: true,
        message: `${deptUser.name} has been promoted to Admin`,
      },
      { status: 200 },
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Session expired" }, { status: 401 });
    }

    console.error("Error promoting department:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
