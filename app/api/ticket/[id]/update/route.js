import { NextResponse } from "next/server";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import verifyUser from "../../../authMiddleware";

export async function PATCH(req, { params }) {
  try {
    await database();

    const token = req.headers.get("authorization");
    const decodedUser = verifyUser(token);
    const { id } = await params;

    const { status, remarks, assignedDept } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Ticket ID and status are required" },
        { status: 400 }
      );
    }

    // Build new status entry
    const newStatusEntry = {
      status,
      updatedBy: {
        userId: decodedUser?.userId,
        name: decodedUser?.name,
        role: decodedUser?.role,
      },
      remarks,
      date: new Date(),
    };

    console.log(newStatusEntry);
    const updatedTicket = await TicketModel.findByIdAndUpdate(
      id,
      {
        $push: { statusHistory: newStatusEntry },
        $set: { status: status },
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
      message: `Assinged Successfully.`,
      to: `${assignedDept} Department`,
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
