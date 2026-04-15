export const dynamic = "force-dynamic";

// app/api/departments/[id]/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import DepartmentModel from "@/models/Department.model";

export async function GET(req, { params }) {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "Admin")
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 },
      );

    /* ── 2. fetch ── */
    const { id } = await params;
    if (!id)
      return NextResponse.json(
        { success: false, message: "Department ID is required" },
        { status: 400 },
      );

    await database();

    const department = await DepartmentModel.findById(id)
      .populate("assignedUser", "name phone role department")
      .lean();

    if (!department)
      return NextResponse.json(
        { success: false, message: "Department not found" },
        { status: 404 },
      );

    return NextResponse.json({ success: true, department });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return NextResponse.json({ message: "Session expired" }, { status: 401 });

    console.error("Error fetching department:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
