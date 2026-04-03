// app/api/ticket/create/route.js
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import { NextResponse } from "next/server";
import verifyUser from "../../authMiddleware";

// ✅ Helper to send SMS via 2Factor
async function sendTicketSMS({ phone, userName, ticketId, trackingUrl }) {
  const API_KEY = process.env.TWO_FACTOR_API_KEY;
  const SENDER_ID = process.env.TWOFACTOR_SENDER_ID;
  const TEMPLATE_NAME = process.env.TICKET_CREATION_TEMPLATE_NAME;

  console.log("📱 Sending SMS to:", phone, userName, ticketId, trackingUrl);
  const response = await fetch(
    `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=${API_KEY}&to=${phone}&from=${SENDER_ID}&templatename=${TEMPLATE_NAME}&var1=${userName}&var2=${ticketId}&var3=${trackingUrl}`,
    {
      method: "POST",
    },
  );

  const result = await response.json();

  if (result.Status !== "Success") {
    console.error("❌ SMS sending failed:", result);
  } else {
    console.log("✅ SMS sent successfully. Session ID:", result.Details);
  }

  return result;
}

export async function POST(req) {
  try {
    await database();

    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 },
      );
    }

    const {
      user,
      title,
      description,
      complaintType,
      fileUrl,
      assignedDept,
      phone,
      userName,
    } = await req.json();

    const newTicket = new TicketModel({
      user,
      title,
      description,
      complaintType: complaintType || null,
      fileUrl: fileUrl || null,
      assignedDept: assignedDept || null,
    });

    await newTicket.save();

    // ✅ Send SMS after ticket is saved
    if (user?.phone) {
      const shortId = newTicket._id.toString().slice(-8);
      const trackingUrl = `https://www.ssksatna.com/tickets?id=${shortId}`;
      await sendTicketSMS({
        phone: user.phone,
        userName: user?.name || "User",
        ticketId: newTicket._id.toString(),
        trackingUrl,
      });
    }
    return NextResponse.json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("❌ Error creating ticket:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
