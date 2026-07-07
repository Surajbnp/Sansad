export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";

const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;
const SMS_BASE_URL =
  process.env.SMS_BASE_URL || "http://sms.mishtel.net/api/mt/SendSMS";
const PROMOTE_TEMPLATE_ID =
  process.env.SMS_DEPARTMENT_OTP_DLT_TEMPLATE_ID;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await database();

    const admin = await UserModel.findById(decoded.id);

    if (!admin || admin.role !== "Admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can perform this action",
        },
        { status: 403 }
      );
    }

    if (!admin.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Registered mobile number not found for this admin account",
        },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    await Otp.deleteMany({ email: admin.phone });

    await Otp.create({
      email: admin.phone,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // SMS Text
    const recipientName = admin.name || "Admin";

    const text = `Dear ${recipientName},

Your OTP to create a new department on Sansad Suvidha Kendra https://www.ssksatna.com/ is ${otp}. It is valid for 5 minutes.

- Ganesh Singh`;

    const url = `${SMS_BASE_URL}?apikey=${SMS_API_KEY}&senderid=${SMS_SENDER_ID}&channel=Trans&DCS=0&flashsms=0&number=${admin.phone}&text=${encodeURIComponent(
      text
    )}&route=1&DLTTemplateId=${PROMOTE_TEMPLATE_ID}`;

    const res = await fetch(url);
    const responseText = await res.text();

    let response = {};

    try {
      response = JSON.parse(responseText);
    } catch {
      response = {};
    }

    // HTTP error
    if (!res.ok) {
      await Otp.deleteMany({ email: admin.phone });

      return NextResponse.json(
        {
          success: false,
          message: "OTP bhejne me asafal",
          response: responseText,
        },
        { status: 502 }
      );
    }

    // STPL Error
    if (response.ErrorCode !== "000") {
      await Otp.deleteMany({ email: admin.phone });

      return NextResponse.json(
        {
          success: false,
          message: response.ErrorMessage || "OTP bhejne me asafal",
          response,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your registered number",
      },
      { status: 200 }
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          success: false,
          message: "Session expired",
        },
        { status: 401 }
      );
    }

    console.error("Error sending OTP:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}