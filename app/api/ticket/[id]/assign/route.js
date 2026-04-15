export const dynamic = "force-dynamic";

// app/api/ticket/[id]/assign/route.js

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

    if (decoded.role !== "Admin")
      return NextResponse.json(
        { message: "Forbidden — Admin only" },
        { status: 403 },
      );

    /* ── 2. inputs ── */
    const { id } = await params;
    const { status, remarks, assignedDept } = await req.json();

    if (!id || !assignedDept)
      return NextResponse.json(
        { success: false, message: "Ticket ID and department are required" },
        { status: 400 },
      );

    /* ── 3. update ── */
    await database();

    const updatedTicket = await TicketModel.findByIdAndUpdate(
      id,
      {
        $push: {
          statusHistory: {
            status: status || "Assigned",
            remarks,
            updatedBy: {
              userId: decoded.id,
              name: decoded.name,
              role: decoded.role,
            },
            date: new Date(),
          },
        },
        $set: { status: status || "Assigned", assignedDept },
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
      message: "Assigned Successfully.",
      to: `To ${assignedDept} Department`,
      ticket: updatedTicket,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return NextResponse.json(
        { message: "Session expired, please login again" },
        { status: 401 },
      );

    console.error("Assign route error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
