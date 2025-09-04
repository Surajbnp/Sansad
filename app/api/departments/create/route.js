import { NextResponse } from "next/server";
import mongoose from "mongoose";
import DepartmentModel from "@/models/Department.model";
import UserModel from "@/models/User.model";
import database from "@/lib/database";
import verifyUser from "../../authMiddleware";

export async function POST(req) {
  try {
    await database();

    const token = req.headers.get("authorization");
    const decoded = verifyUser(token);

    console.log(decoded);

    const user = await UserModel.findById(decoded.userId);
    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can create departments" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, assignedTo } = body;

    const existing = await DepartmentModel.findOne({ name });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Department already exists" },
        { status: 400 }
      );
    }

    const payload = {
      name,
      createdBy: {
        name: user?.name,
        userId: user._id.toString(),
      },
      assignedTo,
    };

    const department = new DepartmentModel(payload);
    await department.save();

    return NextResponse.json({ success: true, department }, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
