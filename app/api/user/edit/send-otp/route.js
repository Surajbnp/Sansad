import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    const { type, phone } = await req.json();

    /* ── 1. validate type ── */
    if (!type || !["new-phone", "submit"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid request type" },
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

    /* ── 3. connect db + resolve target phone ── */
    await database();

    let targetPhone;

    if (type === "new-phone") {
      /* ── 3a. validate format ── */
      const cleaned = String(phone ?? "").replace(/\D/g, "");
      if (cleaned.length !== 10) {
        return NextResponse.json(
          {
            success: false,
            message: "A valid 10-digit phone number is required",
          },
          { status: 400 },
        );
      }

      /* ── 3b. ensure new phone is not already taken by ANY user ── */
      const existing = await UserModel.findOne(
        { phone: cleaned },
        { _id: 1 },
      ).lean();

      if (existing) {
        // covers both: taken by someone else, or user submitting their own current number
        return NextResponse.json(
          {
            success: false,
            message: "This phone number is already registered",
          },
          { status: 409 },
        );
      }

      targetPhone = cleaned;
    } else {
      /* ── type === "submit": send OTP to current registered phone ── */
      const user = await UserModel.findById(decoded.id, { phone: 1 }).lean();

      if (!user?.phone) {
        return NextResponse.json(
          { success: false, message: "No phone number on file" },
          { status: 400 },
        );
      }

      targetPhone = user.phone;
    }

    /* ── 4. send OTP via 2Factor ── */
    const API_KEY = process.env.TWO_FACTOR_API_KEY;
    const OTP_TEMPLATE = process.env.LOGIN_TEMPLATE_NAME;

    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${targetPhone}/AUTOGEN/${OTP_TEMPLATE}`;

    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (data.Status !== "Success") {
      return NextResponse.json(
        { success: false, message: "Failed to send OTP" },
        { status: 500 },
      );
    }

    /* ── 5. return session id ── */
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      sessionId: data.Details,
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
