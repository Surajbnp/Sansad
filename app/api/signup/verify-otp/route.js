import { NextResponse } from "next/server";
import crypto from "crypto";
import database from "@/lib/database";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await database();

    // 🚫 CHECK IF USER ALREADY EXISTS
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // 🔍 FIND OTP RECORD
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // ⏱ CHECK EXPIRY
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    // 🔐 VERIFY OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== otpRecord.otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 🧹 DELETE OTP AFTER SUCCESS
    await Otp.deleteOne({ email });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("SIGNUP OTP VERIFY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "OTP verification failed" },
      { status: 500 }
    );
  }
}
