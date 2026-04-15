export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    const { otp, phone, sessionId } = await req.json();

    /* ── 1. validate inputs ── */
    if (!otp || !phone || !sessionId) {
      return NextResponse.json(
        { success: false, message: "OTP, phone and sessionId are required" },
        { status: 400 },
      );
    }

    const cleaned = String(phone).replace(/\D/g, "");
    if (cleaned.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 },
      );
    }

    if (String(otp).length !== 6) {
      return NextResponse.json(
        { success: false, message: "OTP must be 6 digits" },
        { status: 400 },
      );
    }

    /* ── 2. auth check ── */
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    /* ── 3. re-check phone is still not taken ── */
    // guards against a race condition where someone else registers
    // the same number between send-otp and verify
    await database();

    const existing = await UserModel.findOne(
      { phone: cleaned },
      { _id: 1 },
    ).lean();

    if (existing) {
      return NextResponse.json(
        { success: false, message: "This phone number is already registered" },
        { status: 409 },
      );
    }

    /* ── 4. verify OTP with 2Factor ── */
    const API_KEY = process.env.TWO_FACTOR_API_KEY;

    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`;

    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (data.Status !== "Success" || data.Details !== "OTP Matched") {
      return NextResponse.json(
        { success: false, message: "Incorrect OTP. Please try again." },
        { status: 400 },
      );
    }

    /* ── 5. verification passed ── */
    // We do NOT update the DB here — the phone is written
    // only after the final submit OTP is verified in /api/user/edit
    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
    });
  } catch (err) {
    console.error("VERIFY NEW PHONE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
