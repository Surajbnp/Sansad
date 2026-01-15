import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import DepartmentModel from "@/models/Department.model";
import { NextResponse } from "next/server";
import verifyUser from "../../authMiddleware";

export async function GET(req) {
  try {
    await database();

    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token missing" },
        { status: 401 }
      );
    }

    const decoded = verifyUser(token);

    let matchQuery = {};

    /* ================= ROLE BASE ================= */
    if (decoded.role === "User") {
      matchQuery = { "user.userId": decoded.userId };
    }

    if (decoded.role === "Department") {
      if (!decoded.department) {
        return NextResponse.json(
          { success: false, message: "Department not assigned" },
          { status: 403 }
        );
      }
      matchQuery = { assignedDept: decoded.department };
    }

    /* ================= AGGREGATE RAW STATUS ================= */
    const rawStats = await TicketModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    /* ================= MAP TO BUSINESS STATES ================= */
    const summary = {
      submitted: 0,
      assigned: 0,
      inProgress: 0,
      completed: 0,
    };

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

    /* ================= ADMIN EXTRA ================= */
    let departmentCount;
    if (decoded.role === "Admin") {
      departmentCount = await DepartmentModel.countDocuments();
    }

    return NextResponse.json({
      success: true,
      role: decoded.role,
      totalTickets,
      stats: summary,
      departmentCount,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
