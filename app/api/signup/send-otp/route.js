// app/api/send-otp/route.js

import { NextResponse } from "next/server";

const API_KEY       = process.env.TWO_FACTOR_API_KEY;
const OTP_TEMPLATE  = process.env.SIGNUP_TEMPLATE_NAME;

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

    /* ── call 2factor API ── */
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN/${OTP_TEMPLATE}`;

    const res  = await fetch(url);
    const data = await res.json();

    // 2factor returns { Status: "Success", Details: "<session_id>" }
    if (data.Status !== "Success") {
      console.error("2factor error:", data);
      return NextResponse.json(
        { message: "OTP भेजने में असफल, कृपया पुनः प्रयास करें" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { message: "OTP सफलतापूर्वक भेजा गया" },
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