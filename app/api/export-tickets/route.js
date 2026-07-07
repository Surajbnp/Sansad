import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import UserModel from "@/models/User.model";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await database();

    const tickets = await TicketModel.find({}).lean();

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
      { wch: 8 },
      { wch: 28 },
      { wch: 25 },
      { wch: 15 },
      { wch: 28 },
      { wch: 35 },
      { wch: 25 },
      { wch: 10 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 35 },
      { wch: 60 },
      { wch: 20 },
      { wch: 15 },
      { wch: 22 },
      { wch: 40 },
      { wch: 22 },
      { wch: 22 },
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