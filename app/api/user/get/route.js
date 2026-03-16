import { NextResponse } from "next/server";
import database from "@/lib/database";
import UserModel from "@/models/User.model";
import verifyUser from "../../authMiddleware";

export async function GET(req) {
  try {
    await database();

    // 1️⃣ Read token
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify token
    const decoded = verifyUser(token);

    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 3️⃣ Fetch user from DB (SOURCE OF TRUTH) OTP with moible
    const user = await UserModel.findById(decoded.userId).select(
      "_id name email role aadhar whatsapp address voterId"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    // 4️⃣ Return fresh user
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("AUTH /me error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
