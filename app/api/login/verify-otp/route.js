export const dynamic = "force-dynamic";

// app/api/login/verify-otp/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import UserModel from "@/models/User.model";
import Otp from "@/models/Otp.model";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();

    /* ── 1. validate inputs ── */
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें",
        },
        { status: 400 },
      );
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: "कृपया सही 6 अंकों का OTP दर्ज करें" },
        { status: 400 },
      );
    }

    /* ── legacy 2factor flow kept commented below for reference ── */
    // const API_KEY = process.env.TWO_FACTOR_API_KEY;
    // const verifyUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY3/${phone}/${otp}`;
    // const verifyRes = await fetch(verifyUrl);
    // const verifyData = await verifyRes.json();
    // if (verifyData.Status !== "Success") {
    //   const messageMap = {
    //     "OTP Expired": "OTP की समय सीमा समाप्त हो गई, पुनः भेजें",
    //     "OTP MisMatch": "गलत OTP दर्ज किया गया, पुनः प्रयास करें",
    //   };
    //   const reason = messageMap[verifyData.Details] || verifyData.Details || "OTP सत्यापन विफल";
    //   return NextResponse.json({ success: false, message: reason }, { status: 400 });
    // }

    await database();
    /* ── 2. verify OTP locally using the stored STPL OTP ── */
    const otpRecord = await Otp.findOne({ email: phone });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "OTP की समय सीमा समाप्त हो गई, पुनः भेजें" },
        { status: 400 },
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email: phone });
      return NextResponse.json(
        { success: false, message: "OTP की समय सीमा समाप्त हो गई, पुनः भेजें" },
        { status: 400 },
      );
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== otpRecord.otp) {
      return NextResponse.json(
        { success: false, message: "गलत OTP दर्ज किया गया, पुनः प्रयास करें" },
        { status: 400 },
      );
    }

    

    /* ── 3. find user ── */


    const user = await UserModel.findOne({ phone });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "इस नंबर से कोई अकाउंट नहीं मिला, पहले रजिस्टर करें",
        },
        { status: 404 },
      );
    }

    /* ── 4. generate JWT ── */
    const token = jwt.sign(
      {
        id: user._id,
        phone: user.phone,
        role: user.role,
        department: user.department,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    /* ── 5. set httpOnly cookie + return response ── */
    const response = NextResponse.json(
      { success: true, message: "Login successful." },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
await Otp.deleteOne({ email: phone });
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 },
    );
  }
}
