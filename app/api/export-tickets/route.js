import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import UserModel from "@/models/User.model";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await database();

    // optional date range filters
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const q = {};
    if (start || end) {
      q.createdAt = {};
      if (start) {
        const s = new Date(start);
        if (!isNaN(s)) q.createdAt.$gte = s;
      }
      if (end) {
        const e = new Date(end);
        if (!isNaN(e)) {
          e.setHours(23, 59, 59, 999);
          q.createdAt.$lte = e;
        }
      }
    }

    const tickets = await TicketModel.find(q).lean();

    const data = await Promise.all(
      tickets.map(async (ticket, index) => {
        // User details fetch
        const user = await UserModel.findById(ticket.user?.userId).lean();
return {
  "S.No": index + 1,
  "Ticket ID": ticket._id.toString(),
  Name: ticket.user?.name || "",
  Phone: ticket.user?.phone || "",
  "User ID": ticket.user?.userId || "",
  Address: user?.address || "",
  Vidhansabha: user?.vidhansabha || "",
  District: user?.district || "",
  Tehsil: user?.tehsil || "",
  Gender: user?.sex || "",
  "Voter ID": user?.voterId || "",
  Aadhaar: user?.aadhar || "",
  WhatsApp: user?.whatsapp || "",
  Title: ticket.title || "",
  Description: ticket.description || "",
  "Complaint Type": ticket.complaintType || "",
  Status: ticket.status || "",
  "Assigned Department": ticket.assignedDept || "",
  "File URL": ticket.fileUrl || "",

  "Created At": ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleString("en-IN")
    : "",

  "Updated At": ticket.updatedAt
    ? new Date(ticket.updatedAt).toLocaleString("en-IN")
    : "",
};
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto column width
 worksheet["!cols"] = [
  { wch: 8 },   // S.No
  { wch: 28 },  // Ticket ID
  { wch: 25 },  // Name
  { wch: 15 },  // Phone
  { wch: 28 },  // User ID
  { wch: 35 },  // Address
  { wch: 25 },  // Vidhansabha
  { wch: 22 },  // District
  { wch: 22 },  // Tehsil
  { wch: 10 },  // Gender
  { wch: 20 },  // Voter ID
  { wch: 18 },  // Aadhaar
  { wch: 18 },  // WhatsApp
  { wch: 35 },  // Title
  { wch: 60 },  // Description
  { wch: 20 },  // Complaint Type
  { wch: 15 },  // Status
  { wch: 22 },  // Assigned Department
  { wch: 40 },  // File URL
  { wch: 22 },  // Created At
  { wch: 22 },  // Updated At
];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="Tickets_Report.xlsx"',
      },
    });
  } catch (error) {
    console.error("Export Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}