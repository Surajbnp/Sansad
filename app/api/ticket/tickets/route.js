import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import { NextResponse } from "next/server";
import verifyUser from "../../authMiddleware";

/* ================= BUSINESS STATE → DB STATUS MAP ================= */
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
    await database();

    /* ================= AUTH ================= */
    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token missing" },
        { status: 401 }
      );
    }

    const decoded = verifyUser(token);

    /* ================= QUERY PARAM ================= */
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state"); // submitted | assigned | inprogress | completed | all

    /* ================= BASE QUERY (ROLE FIRST) ================= */
    const query = {};

    if (decoded.role === "User") {
      query["user.userId"] = decoded.userId;
    }

    if (decoded.role === "Department") {
      if (!decoded.department) {
        return NextResponse.json(
          { success: false, message: "Department not assigned" },
          { status: 403 }
        );
      }
      query.assignedDept = decoded.department;
    }

    // Admin → no role restriction

    /* ================= BUSINESS STATE FILTER ================= */
    if (state && state.toLowerCase() !== "all") {
      const normalizedState = state.toLowerCase();
      const statuses = STATE_STATUS_MAP[normalizedState];

      if (!statuses) {
        return NextResponse.json(
          { success: false, message: "Invalid state filter" },
          { status: 400 }
        );
      }

      query.status = { $in: statuses };
    }
    // else → no status filter applied (ALL tickets for role)

    /* ================= FETCH ================= */
    const tickets = await TicketModel.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      total: tickets.length,
      state: state || "all",
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
