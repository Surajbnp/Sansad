// app/api/stats/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import DepartmentModel from "@/models/Department.model";

export async function GET() {
  try {
    /* ── 1. read & verify token from cookie ── */
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token missing" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ── 2. connect DB ── */
    await database();

    let matchQuery = {};

    /* ── 3. role-based filter ── */
    if (decoded.role === "User") {
      matchQuery = { "user.userId": decoded.id };
    }

    if (decoded.role === "Department") {
      if (!decoded.department) {
        return NextResponse.json(
          { success: false, message: "Department not assigned" },
          { status: 403 },
        );
      }
      matchQuery = { assignedDept: decoded.department };
    }

    // Admin → matchQuery stays {} → matches all tickets

    /* ── 4. aggregate raw status counts ── */
    const rawStats = await TicketModel.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    /* ── 5. map to business states ── */
    const summary = { submitted: 0, assigned: 0, inProgress: 0, completed: 0 };
    let totalTickets = 0;

    rawStats.forEach(({ _id: status, count }) => {
      totalTickets += count;

      switch (status) {
        case "Submitted":
          summary.submitted += count;
          break;
        case "Assigned":
          summary.assigned += count;
          break;
        case "In Progress":
        case "Awaiting User Response":
        case "User Respond Received":
          summary.inProgress += count;
          break;
        case "Resolved":
        case "Closed":
          summary.completed += count;
          break;
        default:
          break;
      }
    });

    /* ── 6. admin extra ── */
    const departmentCount =
      decoded.role === "Admin"
        ? await DepartmentModel.countDocuments()
        : undefined;

    return NextResponse.json({
      success: true,
      role: decoded.role,
      totalTickets,
      stats: summary,
      departmentCount,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, message: "Session expired, please login again" },
        { status: 401 },
      );
    }

    console.error("Stats error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
