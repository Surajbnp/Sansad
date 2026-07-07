export const dynamic = "force-dynamic";

// app/api/departments/create/route.js

import crypto from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import DepartmentModel from "@/models/Department.model";
import Otp from "@/models/Otp.model";
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
const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

const otpRecord = await Otp.findOne({ email: assignedPhone });

if (!otpRecord) {
  return NextResponse.json(
    { success: false, message: "Invalid or expired OTP" },
    { status: 400 },
  );
}

if (otpRecord.expiresAt < new Date()) {
  await Otp.deleteOne({ email: assignedPhone });

  return NextResponse.json(
    { success: false, message: "OTP expired" },
    { status: 400 },
  );
}

if (otpRecord.otp !== hashedOtp) {
  return NextResponse.json(
    { success: false, message: "Invalid OTP" },
    { status: 400 },
  );
}

/* ── check duplicates ── */

const existingDept = await DepartmentModel.findOne({ name });

if (existingDept) {
  return NextResponse.json(
    { success: false, message: "Department already exists" },
    { status: 409 }
  );
}

const existingUser = await UserModel.findOne({
  phone: assignedPhone,
});

if (existingUser) {
  return NextResponse.json(
    {
      success: false,
      message: "A user with this phone number already exists",
    },
    { status: 409 }
  );
}

/* ── create user ── */

const deptUser = await UserModel.create({
  name: assignedName,
  phone: assignedPhone,
  role: "Department",
  department: name,
});

/* ── create department ── */

const slug = await generateSlug(name);

const department = await DepartmentModel.create({
  name,
  slug,
  designation: assignedDesignation,
  phone: assignedContact || assignedPhone,
  createdBy: {
    userId: admin._id,
    name: admin.name,
  },
  assignedUser: deptUser._id,
});

// Delete OTP after successful creation
await Otp.deleteOne({ email: assignedPhone });

return NextResponse.json(
  {
    success: true,
    department,
  },
  { status: 201 }
);

} catch (err) {
  if (err.name === "TokenExpiredError") {
    return NextResponse.json(
      { message: "Session expired" },
      { status: 401 }
    );
  }

  console.error("Error creating department:", err);

  return NextResponse.json(
    {
      success: false,
      message: "Server error",
    },
    { status: 500 }
  );
}
}