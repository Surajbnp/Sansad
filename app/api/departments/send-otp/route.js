import crypto from "crypto";
import { NextResponse } from "next/server";
import database from "@/lib/database";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";

const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || "GNSNGH";
const SMS_BASE_URL =
  process.env.SMS_BASE_URL || "http://sms.mishtel.net/api/mt/SendSMS";
const SMS_DEPARTMENT_OTP_DLT_TEMPLATE_ID =
  process.env.SMS_DEPARTMENT_OTP_DLT_TEMPLATE_ID || "1707178281009072678";

export async function POST(request) {
  try {
    const { phone, assignedName } = await request.json();

    /* ── 1. validate ── */
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { message: "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें" },
        { status: 400 },
      );
    }

    /* ── 2. check user exists in DB ── */
    await database();
    const user = await UserModel.findOne({ phone });

    if (user) {
      return NextResponse.json(
        {
          message: "इस नंबर से पहले से अकाउंट मौजूद है",
          actions: [
            { label: "लॉगिन करें", href: "/login" },
            { label: "दूसरा नंबर दर्ज करें", action: "reset" },
          ],
        },
        { status: 409 },
      );
    }

    /* ── 3. create local OTP and save it for verification ── */
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await Otp.deleteMany({ email: phone });
    await Otp.create({
      email: phone,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const recipientName = assignedName || "User";
    const text = `Dear ${recipientName},\n\nYour OTP to create a new department on Sansad Suvidha Kendra https://www.ssksatna.com/ is ${otp}. It is valid for 5 minutes.\n\n- Ganesh Singh`;

    const params = new URLSearchParams({
      apikey: SMS_API_KEY,
      senderid: SMS_SENDER_ID,
      channel: "Trans",
      DCS: "0",
      flashsms: "0",
      number: phone,
      text,
      route: "1",
      DLTTemplateId: SMS_DEPARTMENT_OTP_DLT_TEMPLATE_ID,
    });

    const url = `${SMS_BASE_URL}?${params.toString()}`;
    const res = await fetch(url);
    const responseText = await res.text();

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
console.log("STPL:", responseText);

const data = JSON.parse(responseText);

if (data.ErrorCode === "000") {
  return NextResponse.json(
    {
      message: "OTP सफलतापूर्वक भेजा गया",
    },
    { status: 200 }
  );
}

await Otp.deleteMany({ email: phone });

return NextResponse.json(
  {
    message: "OTP भेजने में असफल",
    response: data,
  },
  { status: 502 }
);

    await Otp.deleteMany({ email: phone });

    return NextResponse.json(
      {
        message: "OTP भेजने में असफल",
        response: responseText,
      },
      { status: 502 },
    );
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
