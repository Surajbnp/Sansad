import { NextResponse } from "next/server";
import DepartmentModel from "@/models/Department.model";
import UserModel from "@/models/User.model";
import database from "@/lib/database";
import verifyUser from "../../authMiddleware";

export async function GET(req) {
  try {
    await database();

    const token = req.headers.get("authorization");
    const decoded = verifyUser(token);

    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await UserModel.findById(decoded.userId);

    if (!admin || admin.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    // ✅ Fetch departments with assigned user info
    const departments = await DepartmentModel.find()
      .populate("assignedUser", "name email role department")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
