import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import database from "@/lib/database";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    const { email, mailHeading, mailSubject } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    await database();

    // 🔍 CHECK: Email should NOT exist (signup flow)
    const existingUser = await UserModel.findOne({ email }).select("_id");

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 }
      );
    }

    // 🔢 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 Hash OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // ⏱ Expiry: 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 🧹 Remove any previous OTPs for this email
    await Otp.deleteMany({ email });

    // 💾 Save OTP
    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt,
      purpose: "signup", // 🔥 optional but recommended
    });

    // 📧 Mail transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // ✉️ Send OTP mail
    await transporter.sendMail({
      from: `"Sansad App" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: mailSubject || "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>${mailHeading || "Email Verification"}</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>If you didn’t request this, please ignore.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("SEND OTP SIGNUP ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
