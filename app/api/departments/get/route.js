// app/api/departments/get/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import DepartmentModel from "@/models/Department.model";
import UserModel from "@/models/User.model";

export async function GET() {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await database();

    // Admin only
    if (decoded.role !== "Admin")
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 },
      );

    /* ── 2. fetch ── */
    const departments = await DepartmentModel.find()
      .populate("assignedUser", "name phone role department")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, departments });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return NextResponse.json({ message: "Session expired" }, { status: 401 });

    console.error("Error fetching departments:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
