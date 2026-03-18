// app/api/departments/create/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import DepartmentModel from "@/models/Department.model";
import UserModel from "@/models/User.model";

/* ── slug generator ── */
const generateSlug = async (name) => {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 1;
  while (await DepartmentModel.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
};

export async function POST(req) {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await database();

    const admin = await UserModel.findById(decoded.id);
    if (!admin || admin.role !== "Admin")
      return NextResponse.json(
        { success: false, message: "Only admin can create departments" },
        { status: 403 },
      );

    /* ── 2. body ── */
    const {
      name,
      assignedName,
      assignedPhone,
      assignedContact,
      assignedDesignation,
      otp,
    } = await req.json();

    if (
      !name ||
      !assignedName ||
      !assignedPhone ||
      !assignedDesignation ||
      !otp
    )
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );

    if (!/^\d{10}$/.test(assignedPhone))
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 },
      );

    /* ── 3. verify OTP before doing anything ── */
    const verifyUrl = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY3/${assignedPhone}/${otp}`;
    const verifyRes = await fetch(verifyUrl);
    const verifyData = await verifyRes.json();

    if (verifyData.Status !== "Success") {
      const messageMap = {
        "OTP Expired": "OTP की समय सीमा समाप्त हो गई, पुनः भेजें",
        "OTP MisMatch": "गलत OTP दर्ज किया गया, पुनः प्रयास करें",
      };
      const reason =
        messageMap[verifyData.Details] ||
        verifyData.Details ||
        "OTP verification failed";
      return NextResponse.json(
        { success: false, message: reason },
        { status: 400 },
      );
    }

    /* ── 3. check duplicates ── */
    const existingDept = await DepartmentModel.findOne({ name });
    if (existingDept)
      return NextResponse.json(
        { success: false, message: "Department already exists" },
        { status: 409 },
      );

    const existingUser = await UserModel.findOne({ phone: assignedPhone });
    if (existingUser)
      return NextResponse.json(
        {
          success: false,
          message: "A user with this phone number already exists",
        },
        { status: 409 },
      );

    /* ── 4. create dept user ── */
    const deptUser = await UserModel.create({
      name: assignedName,
      phone: assignedPhone,
      role: "Department",
      department: name,
    });

    /* ── 5. create department ── */
    const slug = await generateSlug(name);

    const department = await DepartmentModel.create({
      name,
      slug,
      designation: assignedDesignation,
      phone: assignedContact || assignedPhone,
      createdBy: { userId: admin._id, name: admin.name },
      assignedUser: deptUser._id,
    });

    return NextResponse.json({ success: true, department }, { status: 201 });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return NextResponse.json({ message: "Session expired" }, { status: 401 });

    console.error("Error creating department:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
