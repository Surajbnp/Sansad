import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import database from "@/lib/database";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    await database();

    // 🔍 Find OTP entry
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // ⏱ Check expiry
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    // 🔐 Hash incoming OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // ❌ OTP mismatch
    if (hashedOtp !== otpRecord.otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 🔐 Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔄 Update user password
    await UserModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // 🧹 Delete OTP after success
    await Otp.deleteOne({ email });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
