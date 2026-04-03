// app/api/ticket/[id]/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import mongoose from "mongoose";

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
    if (!id)
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 },
      );

    await database();

    /* ── 3. build query ── */
    const isFullId = id.length === 24 && mongoose.Types.ObjectId.isValid(id);
    const isAdmin = decoded.role === "Admin" || decoded.role === "Department";

    let ticket = null;

    if (isFullId) {
      // ✅ normal flow — existing functionality unchanged
      const query = isAdmin
        ? { _id: id }
        : { _id: id, "user.userId": decoded.id };

      ticket = await TicketModel.findOne(query);
    } else {
      // ✅ short id from SMS link — match last N chars
      const candidates = await TicketModel.find(
        isAdmin ? {} : { "user.userId": decoded.id },
      )
        .select("_id")
        .lean();

      const match = candidates.find((t) => t._id.toString().endsWith(id));

      if (match) {
        const query = isAdmin
          ? { _id: match._id }
          : { _id: match._id, "user.userId": decoded.id };

        ticket = await TicketModel.findOne(query);
      }
    }

    /* ── 4. respond ── */
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
