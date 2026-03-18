// app/api/ticket/[id]/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";

export async function GET(req, { params }) {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ── 2. validate id ── */
    const { id } = await params;
    console.log("decoded:", JSON.stringify(decoded));
    console.log("ticket id from params:", id);
    if (!id)
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 },
      );

    /* ── 3. fetch ── */
    await database();

    // Admin + Department → any ticket
    // User → only their own tickets
    const query =
      decoded.role === "Admin" || decoded.role === "Department"
        ? { _id: id }
        : { _id: id, "user.userId": decoded.id };

    const ticket = await TicketModel.findOne(query);

    if (!ticket)
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 },
      );

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    if (err.name === "TokenExpiredError")
      return NextResponse.json(
        { message: "Session expired, please login again" },
        { status: 401 },
      );

    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
