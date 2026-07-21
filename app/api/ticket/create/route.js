// app/api/ticket/create/route.js

import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import { NextResponse } from "next/server";

const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID =
  process.env.SMS_SENDER_ID || process.env.TWOFACTOR_SENDER_ID;
const SMS_BASE_URL =
  process.env.SMS_BASE_URL || "http://sms.mishtel.net/api/mt/SendSMS";
const SMS_TICKET_DLT_TEMPLATE_ID =
  process.env.SMS_TICKET_DLT_TEMPLATE_ID || "1707178333748164911";

async function sendTicketSMS({ phone, userName, ticketId }) {
  const trackingUrl = `https://www.ssksatna.com/tickets?id=${ticketId}`;

  const text = `Dear ${userName},

Your request has been registered successfully on Sansad Suvidha Kendra. Your Ticket ID is ${ticketId}.

Track your ticket here: ${trackingUrl}

Our team will get back to you shortly.

- Ganesh Singh`;

  const params = new URLSearchParams({
    apikey: SMS_API_KEY,
    senderid: SMS_SENDER_ID,
    channel: "Trans",
    DCS: "0",
    flashsms: "0",
    number: phone,
    text,
    route: "1",
    DLTTemplateId: SMS_TICKET_DLT_TEMPLATE_ID,
  });

  const url = `${SMS_BASE_URL}?${params.toString()}`;

  console.log("📱 SMS URL:", url);

  const res = await fetch(url);
  const responseText = await res.text();

  console.log("📩 STPL Response:", responseText);

  if (!res.ok) {
    throw new Error("HTTP Error while sending SMS");
  }

  const result = JSON.parse(responseText);

  if (result.ErrorCode !== "000") {
    throw new Error(result.ErrorMessage || "SMS sending failed");
  }

  return result;
}

export async function POST(req) {
  try {
    await database();

    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token provided",
        },
        {
          status: 401,
        }
      );
    }

    const {
      user,
      title,
      description,
      complaintType,
      fileUrl,
      assignedDept,
      division,
      distributionCentre,
    } = await req.json();

    const newTicket = new TicketModel({
      user,
      title,
      description,
      complaintType: complaintType || null,
      fileUrl: fileUrl || null,
      assignedDept: assignedDept || null,
      division: division || null,
      distributionCentre: distributionCentre || null,
    });

    await newTicket.save();

    // Send SMS
    if (user?.phone) {
      await sendTicketSMS({
        phone: user.phone,
        userName: user.name || "User",
        ticketId: newTicket._id.toString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Ticket created successfully",
        ticket: newTicket,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error creating ticket:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}