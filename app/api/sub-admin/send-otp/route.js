import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

// Store OTPs temporarily (use Redis or database in production)
const otpStore = new Map();

export async function POST(req) {
  try {
    await dbConnect();
    const { phone, isEdit, userId } = await req.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    // Check if phone is already registered
    const existingUser = await UserModel.findOne({ phone });
    
    if (existingUser && !isEdit) {
      return NextResponse.json(
        { 
          success: false, 
          message: "This phone number is already registered",
          actions: [
            { label: "Login", href: "/login" },
            { label: "Try another number" }
          ]
        },
        { status: 409 }
      );
    }

    if (existingUser && isEdit && existingUser._id.toString() !== userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "This phone number is already registered to another user" 
        },
        { status: 409 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store OTP with expiry (5 minutes)
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    // Send OTP via SMS (implement your SMS service)
    // await sendSMS(phone, `Your OTP is: ${otp}`);

    console.log(`OTP for ${phone}: ${otp}`); // For development

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully" 
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}

// Helper function to verify OTP (use in create/update routes)
export async function verifyOTP(phone, otp) {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  if (stored.otp !== parseInt(otp)) return false;
  otpStore.delete(phone); // OTP used, delete it
  return true;
}