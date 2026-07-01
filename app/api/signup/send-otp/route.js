// app/api/signup/send-otp/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";
import database from "@/lib/database";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";

const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;
const SMS_BASE_URL = process.env.SMS_BASE_URL || "http://sms.mishtel.net/api/mt/SendSMS";
const REGISTRATION_TEMPLATE_ID = process.env.SMS_REGISTRATION_TEMPLATE_ID || process.env.SMS_TEMPLATE_ID;

export async function POST(request) {
  try {
    const { phone } = await request.json();

    /* ── basic validation ── */
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { message: "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें" },
        { status: 400 }
      );
    }

    /* ── legacy 2factor flow kept commented below for reference ── */
    // const API_KEY = process.env.TWO_FACTOR_API_KEY;
    // const OTP_TEMPLATE = process.env.SIGNUP_TEMPLATE_NAME;
    // const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN/${OTP_TEMPLATE}`;
    // const res = await fetch(url);
    // const data = await res.json();
    // if (data.Status !== "Success") {
    //   console.error("2factor error:", data);
    //   return NextResponse.json(
    //     { message: "OTP भेजने में असफल, कृपया पुनः प्रयास करें" },
    //     { status: 502 }
    //   );
    // }

 

    await database();
    const existingUser = await UserModel.findOne({ phone });

if (existingUser) {
  return NextResponse.json(
    {
      message: "इस मोबाइल नंबर से पहले से अकाउंट मौजूद है।",
    },
    { status: 409 }
  );
}

   /* ── generate OTP and save it for later verification ── */
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

await Otp.deleteMany({ email: phone });

await Otp.create({
  email: phone,
  otp: hashedOtp,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000),
});
   
    /* ── send OTP via STPL SMS API ── */
  const message = `Dear Customer,

Your OTP for Sansad Suvidha Kendra registration is ${otp}. Use this OTP to complete your registration. It is valid for 5 minutes.

Website - https://www.ssksatna.com/

- Ganesh Singh`;
    const url = `${SMS_BASE_URL}?apikey=${SMS_API_KEY}&senderid=${SMS_SENDER_ID}&channel=Trans&DCS=0&flashsms=0&number=${phone}&text=${encodeURIComponent(message)}&route=1&DLTTemplateId=${REGISTRATION_TEMPLATE_ID}`;
    const res = await fetch(url);

const responseText = await res.text();


if (!res.ok) {
  await Otp.deleteMany({ email: phone });

  return NextResponse.json(
    {
      message: "OTP भेजने में असफल",
      response: responseText,
    },
    { status: 502 }
  );
}

return NextResponse.json(
  {
    message: "OTP सफलतापूर्वक भेजा गया",
    response: responseText,
  },
  { status: 200 }
);

  
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}