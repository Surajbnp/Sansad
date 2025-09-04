import { NextResponse } from "next/server";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import verifyUser from "../../authMiddleware";

export async function GET(req, { params }) {
  try {
    await database();

    const token = req.headers.get("authorization");
    const isVerified = verifyUser(token);

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    let ticket;

    if (isVerified?.role === "Admin") {
      ticket = await TicketModel.findOne({
        _id: id,
      });
    } else {
      ticket = await TicketModel.findOne({
        _id: id,
        "user.userId": isVerified?.userId,
      });
    }

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
