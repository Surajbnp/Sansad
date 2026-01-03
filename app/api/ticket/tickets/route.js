import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
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
    console.log(decoded)
    let tickets = [];

    /* ================= ADMIN ================= */
    if (decoded?.role === "Admin") {
      tickets = await TicketModel.find().sort({ createdAt: -1 });
    } else if (decoded?.role === "User") {
      /* ================= USER ================= */
      tickets = await TicketModel.find({
        "user.userId": decoded.userId,
      }).sort({ createdAt: -1 });
    } else if (decoded?.role === "Department") {
      /* ================= DEPARTMENT ================= */
      if (!decoded.department) {
        return NextResponse.json(
          { success: false, message: "Department not assigned" },
          { status: 403 }
        );
      }

      tickets = await TicketModel.find({
        assignedDept: decoded.department, // ✅ IMPORTANT
        // OR: assignedDept: decoded.department
      }).sort({ createdAt: -1 });
    } else {
      /* ================= FALLBACK ================= */
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
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
