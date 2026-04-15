export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    const { otp, sessionId, changes } = await req.json();

    /* ── 1. validate inputs ── */
    if (!otp || !sessionId) {
      return NextResponse.json(
        { success: false, message: "OTP and sessionId are required" },
        { status: 400 },
      );
    }

    if (String(otp).length !== 6) {
      return NextResponse.json(
        { success: false, message: "OTP must be 6 digits" },
        { status: 400 },
      );
    }

    if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
      return NextResponse.json(
        { success: false, message: "No changes provided" },
        { status: 400 },
      );
    }

    /* ── 2. strip to only allowed fields ── */
    const ALLOWED = ["name", "phone", "address"];

    const sanitized = {};
    for (const key of ALLOWED) {
      if (changes[key] !== undefined && changes[key] !== null) {
        sanitized[key] = String(changes[key]).trim();
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 },
      );
    }

    /* ── 3. field-level validation ── */
    if (sanitized.name !== undefined) {
      if (sanitized.name.length < 2) {
        return NextResponse.json(
          { success: false, message: "Name must be at least 2 characters" },
          { status: 400 },
        );
      }
    }

    if (sanitized.phone !== undefined) {
      const cleaned = sanitized.phone.replace(/\D/g, "");
      if (cleaned.length !== 10) {
        return NextResponse.json(
          { success: false, message: "Phone must be a valid 10-digit number" },
          { status: 400 },
        );
      }
      sanitized.phone = cleaned;
    }

    if (sanitized.address !== undefined) {
      if (sanitized.address.length < 5) {
        return NextResponse.json(
          { success: false, message: "Address must be at least 5 characters" },
          { status: 400 },
        );
      }
    }

    /* ── 4. auth check ── */
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

    /* ── 5. connect db ── */
    await database();

    /* ── 6. if phone is being changed, re-check it's still not taken ── */
    if (sanitized.phone) {
      const existing = await UserModel.findOne(
        { phone: sanitized.phone, _id: { $ne: decoded.id } },
        { _id: 1 },
      ).lean();

      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: "This phone number is already registered",
          },
          { status: 409 },
        );
      }
    }

    /* ── 7. verify submit OTP with 2Factor ── */
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

    /* ── 8. apply update ── */
    const updated = await UserModel.findByIdAndUpdate(
      decoded.id,
      { $set: sanitized },
      { new: true, select: "name phone address role vidhansabha voterId" },
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    /* ── 9. return updated user ── */
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updated,
    });
  } catch (err) {
    console.error("EDIT PROFILE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
