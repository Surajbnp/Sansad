// app/api/login/send-otp/route.js

import { NextResponse } from "next/server";
import database from "@/lib/database";
import UserModel from "@/models/User.model";

const API_KEY = process.env.TWO_FACTOR_API_KEY;
const OTP_TEMPLATE = process.env.LOGIN_TEMPLATE_NAME;

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

    /* ── 3. send OTP via 2factor ── */
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN/${OTP_TEMPLATE}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Status !== "Success") {
      console.error("2factor error:", data);
      return NextResponse.json(
        { message: "OTP भेजने में असफल, कृपया पुनः प्रयास करें" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "OTP सफलतापूर्वक भेजा गया" },
      { status: 200 },
    );
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
