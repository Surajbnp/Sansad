// app/api/ticket/create/route.js
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import { NextResponse } from "next/server";
import verifyUser from "../../authMiddleware";

export async function POST(req) {
  try {
    await database();

    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const { user, title, description, fileUrl, assignedDept } =
      await req.json();


    const newTicket = new TicketModel({
      user: user,
      title,
      description,
      fileUrl: fileUrl || null,
      assignedDept: assignedDept || null,
    });

    await newTicket.save();

    return NextResponse.json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("❌ Error creating ticket:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
