// app/api/ticket/[id]/update/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";

export async function PATCH(req, { params }) {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["Admin", "Department"].includes(decoded.role))
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    /* ── 2. inputs ── */
    const { id } = await params;
    const {
      status,
      remarks,
      fileRequired = false,
      expectedResolvedDate = null,
    } = await req.json();

    if (!id || !status)
      return NextResponse.json(
        { success: false, message: "Ticket ID and status are required" },
        { status: 400 },
      );

    if (status === "In Progress" && !expectedResolvedDate)
      return NextResponse.json(
        {
          success: false,
          message: "Expected resolved date is required for In Progress status",
        },
        { status: 400 },
      );

    /* ── 3. update ── */
    await database();

    const newStatusEntry = {
      status,
      remarks,
      fileRequired: status === "Awaiting User Response" ? fileRequired : false,
      expectedResolvedDate:
        status === "In Progress" ? expectedResolvedDate : null,
      updatedBy: { userId: decoded.id, name: decoded.name, role: decoded.role },
      date: new Date(),
    };

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      id,
      {
        $push: { statusHistory: newStatusEntry },
        $set: {
          status,
          expectedResolvedDate:
            status === "In Progress" ? expectedResolvedDate : null,
        },
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
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return NextResponse.json(
        { message: "Session expired, please login again" },
        { status: 401 },
      );

    console.error("Error updating ticket:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
