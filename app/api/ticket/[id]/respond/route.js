export const dynamic = "force-dynamic";

// app/api/ticket/[id]/respond/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import UserModel from "@/models/User.model";

export async function PATCH(req, { params }) {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "User")
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    /* ── 2. inputs ── */
    const { id } = await params;
    const { remarks, fileUrl } = await req.json();

    if (!id || !remarks?.trim())
      return NextResponse.json(
        { success: false, message: "Response text is required" },
        { status: 400 },
      );

    /* ── 3. fetch + validate ── */
    await database();

    const ticket = await TicketModel.findById(id);
    if (!ticket)
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 },
      );

    if (ticket.status !== "Awaiting User Response")
      return NextResponse.json(
        { success: false, message: "Ticket is not awaiting user response" },
        { status: 403 },
      );

    const lastHistory = ticket.statusHistory[ticket.statusHistory.length - 1];
    if (lastHistory?.fileRequired && !fileUrl)
      return NextResponse.json(
        { success: false, message: "File upload is required for this ticket" },
        { status: 400 },
      );

    /* ── 4. push response ── */
    const currentUser = await UserModel.findById(decoded.id).select("name");

    const responseEntry = {
      status: "User Respond Received",
      remarks,
      fileUrl: fileUrl || null,
      fileRequired: false,
      updatedBy: { userId: decoded.id, name: currentUser?.name, role: "User" },
      date: new Date(),
    };

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      id,
      {
        $push: { statusHistory: responseEntry },
        $set: { status: "User Respond Received" },
      },
      { new: true },
    );

    if (!updatedTicket)
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 },
      );

    return NextResponse.json({
      success: true,
      message: "Response submitted successfully",
      ticket: updatedTicket,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return NextResponse.json(
        { message: "Session expired, please login again" },
        { status: 401 },
      );

    console.error("Respond route error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
