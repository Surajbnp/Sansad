export const dynamic = "force-dynamic";

// app/api/signup/verify-otp/route.js

import { NextResponse } from "next/server";
import database from "@/lib/database";
import UserModel from "@/models/User.model";
import jwt from "jsonwebtoken";

const API_KEY = process.env.TWO_FACTOR_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, otp, name, address, sex, voterId, aadhar, vidhansabha } =
      body;

    /* ── 1. validate inputs ── */
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { message: "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें" },
        { status: 400 },
      );
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "कृपया सही 6 अंकों का OTP दर्ज करें" },
        { status: 400 },
      );
    }

    /* ── 2. verify OTP with 2factor ── */
    const verifyUrl = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY3/${phone}/${otp}`;
    const verifyRes = await fetch(verifyUrl);
    const verifyData = await verifyRes.json();

    if (verifyData.Status !== "Success") {
      const messageMap = {
        "OTP Expired": "OTP की समय सीमा समाप्त हो गई, पुनः भेजें",
        "OTP MisMatch": "गलत OTP दर्ज किया गया, पुनः प्रयास करें",
      };
      const reason =
        messageMap[verifyData.Details] ||
        verifyData.Details ||
        "OTP सत्यापन विफल";
      return NextResponse.json({ message: reason }, { status: 400 });
    }

    /* ── 3. OTP verified → connect DB ── */
    await database();

    const aadharNum = aadhar ? Number(aadhar) : null;

    /* ── 4. check for duplicate user ── */
    const query = { $or: [{ phone }, { aadhar: aadharNum }] };
    if (voterId) query.$or.push({ voterId });

    const existingUser = await UserModel.findOne(query);

    if (existingUser) {
      let message = "User already exists.";
      if (existingUser.phone === phone)
        message = "यह mobile number पहले से पंजीकृत है।";
      else if (existingUser.aadhar === aadharNum)
        message = "यह आधार पहले से पंजीकृत है।";
      else if (voterId && existingUser.voterId === voterId)
        message = "यह वोटर ID पहले से पंजीकृत है।";

      return NextResponse.json({ message }, { status: 409 });
    }

    /* ── 5. create user ── */
    const newUser = new UserModel({
      name,
      address,
      sex,
      phone,
      voterId,
      aadhar: aadharNum,
      vidhansabha,
    });

    await newUser.save();

    /* ── 6. generate JWT ── */
    const token = jwt.sign(
      { id: newUser._id, phone: newUser.phone,
        role: newUser.role,
        department: newUser.department, },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    /* ── 7. set token in httpOnly cookie + return response ── */
    const response = NextResponse.json(
      { message: "सफलतापूर्वक रजिस्टर किया गया!" },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true, // not accessible via JS — safer
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("signup error:", error.message);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
