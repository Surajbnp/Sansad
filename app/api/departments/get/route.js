import { NextResponse } from "next/server";
import DepartmentModel from "@/models/Department.model";
import UserModel from "@/models/User.model";
import database from "@/lib/database";
import verifyUser from "../../authMiddleware";

export async function GET(req) {
  try {
    await database();

    const token = req.headers.get("authorization");
    const decodedUserId = verifyUser(token);

    if (!decodedUserId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(decodedUserId?.userId).lean();

    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only"},
        { status: 403 }
      );
    }

    const departments = await DepartmentModel.find({});
    return NextResponse.json({ success: true, departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
