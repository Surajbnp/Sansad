import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ROLES } from "@/constants/roles";

export async function DELETE(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const deletedUser = await UserModel.findOneAndDelete({ 
      _id: userId, 
      role: ROLES.SUB_ADMIN 
    });

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "Sub-admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Sub-admin deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting sub-admin:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete sub-admin" },
      { status: 500 }
    );
  }
}