import { NextResponse } from "next/server";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import verifyUser from "../../../authMiddleware";

export async function PATCH(req, { params }) {
  try {
    await database();

    const token = req.headers.get("authorization");
    const decodedUser = verifyUser(token);

    if (!decodedUser?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only Admin / Department can update
    if (!["Admin", "Department"].includes(decodedUser.role)) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = params;
    const {
      status,
      remarks,
      fileRequired = false,
      expectedResolvedDate = null,
    } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Ticket ID and status are required" },
        { status: 400 }
      );
    }

    // Business rules
    if (status === "In Progress" && !expectedResolvedDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Expected resolved date is required for In Progress status",
        },
        { status: 400 }
      );
    }

    // Build new status entry
    const newStatusEntry = {
      status,
      remarks,
      fileRequired: status === "Awaiting User Response" ? fileRequired : false,
      expectedResolvedDate:
        status === "In Progress" ? expectedResolvedDate : null,
      updatedBy: {
        userId: decodedUser.userId,
        name: decodedUser.name,
        role: decodedUser.role,
      },
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
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
