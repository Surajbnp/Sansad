export const dynamic = "force-dynamic";

// app/api/tickets/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";

const STATE_STATUS_MAP = {
  submitted: ["Submitted"],
  assigned: ["Assigned"],
  inprogress: [
    "In Progress",
    "Awaiting User Response",
    "User Respond Received",
  ],
  completed: ["Resolved", "Closed"],
};

export async function GET(req) {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ── 2. connect DB ── */
    await database();

    /* ── 3. role-based base query ── */
    const query = {};

    if (decoded.role === "User") {
      query["user.userId"] = decoded.id;
    }

    if (decoded.role === "Department") {
      if (!decoded.department) {
        return NextResponse.json(
          { success: false, message: "Department not assigned" },
          { status: 403 },
        );
      }
      query.assignedDept = decoded.department;
    }

    // Admin → no restriction, sees all tickets

    /* ── 4. state filter ── */
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");

    if (state && state.toLowerCase() !== "all") {
      const statuses = STATE_STATUS_MAP[state.toLowerCase()];

      if (!statuses) {
        return NextResponse.json(
          { success: false, message: "Invalid state filter" },
          { status: 400 },
        );
      }

      query.status = { $in: statuses };
    }

    /* ── 5. fetch ── */
    const tickets = await TicketModel.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      total: tickets.length,
      state: state || "all",
      tickets,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { message: "Session expired, please login again" },
        { status: 401 },
      );
    }

    console.error("Error fetching tickets:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}
