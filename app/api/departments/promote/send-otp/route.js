// app/api/departments/promote/send-otp/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import UserModel from "@/models/User.model";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await database();

    const admin = await UserModel.findById(decoded.id);
    if (!admin || admin.role !== "Admin")
      return NextResponse.json(
        { success: false, message: "Only admin can perform this action" },
        { status: 403 },
      );

    /* ── send OTP to admin's own phone ── */
    const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${admin.phone}/AUTOGEN/${process.env.LOGIN_TEMPLATE_NAME}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Status !== "Success")
      return NextResponse.json(
        { success: false, message: "Failed to send OTP" },
        { status: 500 },
      );

    return NextResponse.json({
      success: true,
      message: "OTP sent to your registered number",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return NextResponse.json({ message: "Session expired" }, { status: 401 });

    console.error("Error sending OTP:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
