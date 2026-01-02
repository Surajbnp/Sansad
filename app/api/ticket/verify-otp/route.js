import { NextResponse } from "next/server";
import crypto from "crypto";
import database from "@/lib/database";
import Otp from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import TicketModel from "@/models/Ticket.model";

export async function POST(req) {
  try {
    const { email, otp, ticketId } = await req.json();

    if (!email || !otp || !ticketId) {
      return NextResponse.json(
        { success: false, message: "Email, OTP and Ticket ID are required" },
        { status: 400 }
      );
    }

    await database();

    /* =========================
       1️⃣ VERIFY OTP
    ========================== */

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== otpRecord.otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    /* =========================
       2️⃣ FETCH USER BY EMAIL
    ========================== */

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* =========================
       3️⃣ FETCH TICKET BY USER
    ========================== */

    const ticket = await TicketModel.findOne({
      _id: ticketId,
      "user.userId": user._id,
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found for this user" },
        { status: 404 }
      );
    }

    // 🧹 Delete OTP after success
    await Otp.deleteOne({ email });

    /* =========================
       4️⃣ SAFE RESPONSE
    ========================== */

    const safeTicket = {
      _id: ticket._id,
      ticketId: ticket.ticketId || ticket._id,
      status: ticket.status,
      statusHistory: ticket.statusHistory,
      subject: ticket.subject,
      description: ticket.description,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    return NextResponse.json({
      success: true,
      ticket: safeTicket,
    });
  } catch (error) {
    console.error("TICKET OTP VERIFY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "OTP verification failed" },
      { status: 500 }
    );
  }
}
