// app/api/export-tickets/route.js - Sirf Excel aur CSV return karo, PDF frontend se generate karo

import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import UserModel from "@/models/User.model";
import { PREDEFINED_TYPES } from "@/constants/ticketTypes";

export const dynamic = "force-dynamic";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const STATE_STATUS_MAP = {
  submitted: ["Submitted"],
  assigned: ["Assigned"],
  inprogress: [
    "In Progress",
    "Awaiting User Response",
    "User Respond Received",
  ],
  completed: ["Resolved", "Closed"],
};

export async function GET(request) {
  try {
    /* ── 1. Auth check ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await database();

    /* ── 2. Get all filters from URL ── */
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "excel";
    const state = searchParams.get("state");
    const search = searchParams.get("search");
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const district = searchParams.get("district");
    const tehsil = searchParams.get("tehsil");
    const upTehsil = searchParams.get("upTehsil");
    const janpad = searchParams.get("janpad");
    const vidhansabha = searchParams.get("vidhansabha");
    const policeStation = searchParams.get("policeStation");
    const department = searchParams.get("department");
    const complaintType = searchParams.get("complaintType");

    /* ── 3. Build ticket query ── */
    const q = {};

    if (decoded.role === "User") {
      q["user.userId"] = decoded.id;
    }

    if (decoded.role === "Department") {
      if (!decoded.department) {
        return NextResponse.json(
          { success: false, message: "Department not assigned" },
          { status: 403 }
        );
      }
      q.assignedDept = decoded.department;
    }

    if (state && state.toLowerCase() !== "all") {
      const statuses = STATE_STATUS_MAP[state.toLowerCase()];
      if (!statuses) {
        return NextResponse.json(
          { success: false, message: "Invalid state filter" },
          { status: 400 }
        );
      }
      q.status = { $in: statuses };
    }

    if (search && search.trim() !== "") {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      q.$or = [
        { title: regex },
        { "user.name": regex },
        { "user.phone": regex },
      ];
    }

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

    /* ── 4. Location filters ── */
    if (decoded.role === "Admin") {
      let userFilter = {};
      
      if (district) userFilter.district = district;
      if (tehsil) userFilter.tehsil = tehsil;
      if (upTehsil) userFilter.upTehsil = upTehsil;
      if (janpad) userFilter.janpad = janpad;
      if (vidhansabha) userFilter.vidhansabha = vidhansabha;
      if (policeStation) userFilter.policeStation = policeStation;
      
      if (Object.keys(userFilter).length > 0) {
        const matchingUsers = await UserModel.find(userFilter, { _id: 1 }).lean();
        const userIds = matchingUsers.map(u => u._id);
        
        if (userIds.length > 0) {
          q["user.userId"] = { $in: userIds };
        } else {
          return NextResponse.json(
            { success: true, total: 0, tickets: [] },
            { status: 200 }
          );
        }
      }
      
      if (department) {
        q.assignedDept = department;
      }
      if (complaintType) {
        if (complaintType === "अन्य (Others)") {
          q.complaintType = { $nin: PREDEFINED_TYPES };
        } else {
          q.complaintType = complaintType;
        }
      }
    }

    /* ── 5. Fetch tickets ── */
    const tickets = await TicketModel.find(q).sort({ createdAt: -1 }).lean();

    /* ── 6. Prepare data ── */
    const data = await Promise.all(
      tickets.map(async (ticket, index) => {
        const user = ticket.user?.userId
          ? await UserModel.findById(ticket.user.userId).lean()
          : null;
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
          "Up Tehsil": user?.upTehsil || "",
          Janpad: user?.janpad || "",
          "Police Station": user?.policeStation || "",
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
            ? new Date(ticket.createdAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })
            : "",
          "Updated At": ticket.updatedAt
            ? new Date(ticket.updatedAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })
            : "",
        };
      })
    );

    /* ── 7. Export based on format ── */
    
    // ── EXCEL (.xlsx) ──
    if (format === "excel" || format === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(data);
      worksheet["!cols"] = [
        { wch: 8 }, { wch: 28 }, { wch: 25 }, { wch: 15 }, { wch: 28 },
        { wch: 35 }, { wch: 25 }, { wch: 22 }, { wch: 22 }, { wch: 22 },
        { wch: 20 }, { wch: 22 }, { wch: 10 }, { wch: 20 }, { wch: 18 },
        { wch: 18 }, { wch: 35 }, { wch: 60 }, { wch: 20 }, { wch: 15 },
        { wch: 22 }, { wch: 40 }, { wch: 22 }, { wch: 22 }
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="Tickets_Report.xlsx"',
        },
      });
    }

    // ── CSV ──
    if (format === "csv") {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="Tickets_Report.csv"',
        },
      });
    }

    // ── PDF ── Return JSON data so frontend can generate PDF
    if (format === "pdf") {
      return NextResponse.json({
        success: true,
        data: data,
        total: data.length,
        message: "PDF data ready"
      });
    }

    // Default: Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="Tickets_Report.xlsx"',
      },
    });

  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}