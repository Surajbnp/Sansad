import { NextResponse } from "next/server";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import verifyUser from "../../../authMiddleware";

export async function PATCH(req, { params }) {
  try {
    await database();

    /* ------------------ AUTH ------------------ */
    const token = req.headers.get("authorization");
    const decodedUser = verifyUser(token);

    if (!decodedUser?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only normal users can respond
    if (decodedUser.role !== "User") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = params;
    const { remarks, fileUrl } = await req.json();

    if (!id || !remarks?.trim()) {
      return NextResponse.json(
        { success: false, message: "Response text is required" },
        { status: 400 }
      );
    }

    /* ------------------ FETCH TICKET ------------------ */
    const ticket = await TicketModel.findById(id);

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    /* ------------------ STATE VALIDATION ------------------ */
    if (ticket.status !== "Awaiting User Response") {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket is not awaiting user response",
        },
        { status: 403 }
      );
    }

    const lastHistory = ticket.statusHistory[ticket.statusHistory.length - 1];

    // File enforcement only if required
    if (lastHistory?.fileRequired && !fileUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "File upload is required for this ticket",
        },
        { status: 400 }
      );
    }

    /* ------------------ BUILD HISTORY ENTRY ------------------ */
    const responseEntry = {
      status: "User Respond Received",
      remarks,
      updatedBy: {
        userId: decodedUser.userId,
        name: decodedUser.name,
        role: "User",
      },
      fileUrl: fileUrl,
      fileRequired: false,
      date: new Date(),
    };

    ticket.statusHistory.push(responseEntry);
    ticket.status = "User Respond Received";

    await ticket.save();

    return NextResponse.json(
      {
        success: true,
        message: "Response submitted successfully",
        ticket,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User respond route error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
