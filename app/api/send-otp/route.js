import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import database from "@/lib/database";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    await database();

    // 🔍 Check if user exists
    const user = await UserModel.findOne({ email }).select("_id");

    // 🚫 Do NOT reveal if user exists or not
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If this email exists, OTP has been sent",
      });
    }

    // 🔢 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 Hash OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // 🧹 Remove old OTP
    await Otp.deleteMany({ email });

    // 💾 Save OTP
    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: expiry,
    });

    // 📧 Email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // ✉️ Send email
    await transporter.sendMail({
      from: `"Sansad App" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>If you didn’t request this, please ignore.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "If this email exists, OTP has been sent",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}

