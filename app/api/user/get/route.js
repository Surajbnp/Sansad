export const dynamic = "force-dynamic";

// app/api/user/get/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import UserModel from "@/models/User.model";

export async function GET() {
  try {
    /* ── 1. read token from httpOnly cookie ── */
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    /* ── 2. verify token ── */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    /* ── 3. fetch user from DB ── */
    await database();
    const user = await UserModel.findById(decoded.id).select("-__v");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    /* ── 4. return user ── */
    return NextResponse.json({ success: true, user });

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, message: "Session expired, please login again" },
        { status: 401 }
      );
    }

    console.error("GET /api/user/get error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}