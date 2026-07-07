export const dynamic = "force-dynamic";

// app/api/signup/verify-otp/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";
import database from "@/lib/database";
import UserModel from "@/models/User.model";
import Otp from "@/models/Otp.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    let {
      phone,
      otp,
      name,
      address,
      sex,
      voterId,
      aadhar,
      vidhansabha,
      district,
      tehsil,
    } = body;

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

    if (!district || !tehsil) {
      return NextResponse.json(
        { message: "कृपया जिला और तहसील चुनें" },
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
    //   return NextResponse.json({ message: reason }, { status: 400 });
    // }

    await database();

    /* ── 2. verify OTP locally using the stored STPL OTP ── */
    const otpRecord = await Otp.findOne({ email: phone });
    if (!otpRecord) {
      return NextResponse.json(
        { message: "OTP की समय सीमा समाप्त हो गई, पुनः भेजें" },
        { status: 400 },
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email: phone });
      return NextResponse.json(
        { message: "OTP की समय सीमा समाप्त हो गई, पुनः भेजें" },
        { status: 400 },
      );
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOtp !== otpRecord.otp) {
      return NextResponse.json(
        { message: "गलत OTP दर्ज किया गया, पुनः प्रयास करें" },
        { status: 400 },
      );
    }



    /* ── 4. sanitize inputs ── */
    let cleanVoterId =
      voterId && voterId.trim() !== "" ? voterId.trim() : undefined;

    let aadharNum =
      aadhar && String(aadhar).trim() !== "" ? Number(aadhar) : undefined;

    /* ── 5. check duplicates ── */
    const query = { $or: [{ phone }] };

    if (aadharNum) query.$or.push({ aadhar: aadharNum });
    if (cleanVoterId) query.$or.push({ voterId: cleanVoterId });

    const existingUser = await UserModel.findOne(query);

    if (existingUser) {
      let message = "User already exists.";

      if (existingUser.phone === phone)
        message = "यह mobile number पहले से पंजीकृत है।";
      else if (aadharNum && existingUser.aadhar === aadharNum)
        message = "यह आधार पहले से पंजीकृत है।";
      else if (cleanVoterId && existingUser.voterId === cleanVoterId)
        message = "यह वोटर ID पहले से पंजीकृत है।";

      return NextResponse.json({ message }, { status: 409 });
    }

    /* ── 6. create user object safely ── */
    const userData = {
      name,
      address,
      sex,
      phone,
      vidhansabha,
      district,
      tehsil,
    };

    if (cleanVoterId) userData.voterId = cleanVoterId;
    if (aadharNum) userData.aadhar = aadharNum;

    const newUser = new UserModel(userData);
    await newUser.save();

    /* ── 7. generate JWT ── */
    const token = jwt.sign(
      {
        id: newUser._id,
        phone: newUser.phone,
        role: newUser.role,
        department: newUser.department,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    /* ── 8. send response with cookie ── */
    const response = NextResponse.json(
      { message: "सफलतापूर्वक रजिस्टर किया गया!" },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    await Otp.deleteOne({ email: phone });

    return response;
  } catch (error) {
    console.error("signup error:", error);

    // handle duplicate key error cleanly
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Duplicate field detected (voterId / phone / aadhar)." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
