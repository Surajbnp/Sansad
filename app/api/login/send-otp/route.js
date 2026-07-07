// app/api/login/send-otp/route.js

import { NextResponse } from "next/server";
import crypto from "crypto";
import database from "@/lib/database";
import UserModel from "@/models/User.model";
import Otp from "@/models/Otp.model";

const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;
const SMS_BASE_URL = process.env.SMS_BASE_URL || "http://sms.mishtel.net/api/mt/SendSMS";
const LOGIN_TEMPLATE_ID = process.env.SMS_LOGIN_TEMPLATE_ID || process.env.SMS_TEMPLATE_ID;

export async function POST(request) {
  try {
    const { phone } = await request.json();

    /* ── 1. validate ── */
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { message: "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें" },
        { status: 400 },
      );
    }

    console.log("Received phone for OTP:", phone);
    /* ── 2. check user exists in DB ── */
    await database();
    const user = await UserModel.findOne({ phone });

    if (!user) {
      return NextResponse.json(
        { message: "इस नंबर से कोई अकाउंट नहीं मिला, पहले रजिस्टर करें" },
        { status: 404 },
      );
    }

    /* ── legacy 2factor flow kept commented below for reference ── */
    // const API_KEY = process.env.TWO_FACTOR_API_KEY;
    // const OTP_TEMPLATE = process.env.LOGIN_TEMPLATE_NAME;
    // const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN/${OTP_TEMPLATE}`;
    // const res = await fetch(url);
    // const data = await res.json();
    // if (data.Status !== "Success") {
    //   console.error("2factor error:", data);
    //   return NextResponse.json(
    //     { message: "OTP भेजने में असफल, कृपया पुनः प्रयास करें" },
    //     { status: 502 },
    //   );
    // }

    /* ── 3. generate OTP and save it for later verification ── */
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await Otp.deleteMany({ email: phone });
    await Otp.create({
      email: phone,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    /* ── 4. send OTP via STPL SMS API ── */
    const message = `Dear Customer,

Your OTP for logging in to your Sansad Suvidha Kendra account is ${otp}. It is valid for 5 minutes.

Website - https://www.ssksatna.com

- Ganesh Singh`;
    const url = `${SMS_BASE_URL}?apikey=${SMS_API_KEY}&senderid=${SMS_SENDER_ID}&channel=Trans&DCS=0&flashsms=0&number=${phone}&text=${encodeURIComponent(message)}&route=1&DLTTemplateId=${LOGIN_TEMPLATE_ID}`;

    console.log("API KEY:", SMS_API_KEY ? "Loaded" : "Missing");
console.log("Sender:", SMS_SENDER_ID);
console.log("Template:", LOGIN_TEMPLATE_ID); // login route me LOGIN_TEMPLATE_ID

console.log("URL:", url);

    const res = await fetch(url);
const responseText = await res.text();


console.log("Status:", res.status);
console.log("Response:", responseText);

if (!res.ok) {
  await Otp.deleteMany({ email: phone });

  return NextResponse.json(
    {
      message: "OTP भेजने में असफल",
      response: responseText,
    },
    { status: 502 },
  );
}

return NextResponse.json(
  {
    message: "OTP सफलतापूर्वक भेजा गया",
  },
  { status: 200 },
);
  } catch (err) {
    console.error("Error in send-otp route:", err);
    
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
