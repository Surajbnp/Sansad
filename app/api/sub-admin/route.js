import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ROLES } from "@/constants/roles";

export async function GET() {
  try {
    await dbConnect();
    
    const subAdmins = await UserModel.find({ 
      role: ROLES.SUB_ADMIN 
    })
    .select("-password -__v")
    .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      users: subAdmins 
    });
  } catch (error) {
    console.error("Error fetching sub-admins:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch sub-admins" },
      { status: 500 }
    );
  }
}