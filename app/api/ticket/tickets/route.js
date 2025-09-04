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

    const isVerified = verifyUser(token);
    let tickets;

    if (isVerified?.role === "Admin") {
      tickets = await TicketModel.find().sort({
        createdAt: -1,
      });
    } else if (isVerified?.role === "User") {
      tickets = await TicketModel.find({
        "user.userId": isVerified?.userId,
      }).sort({
        createdAt: -1,
      });
    }

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
