// export const dynamic = "force-dynamic";

// // app/api/tickets/route.js

// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import database from "@/lib/database";
// import TicketModel from "@/models/Ticket.model";

// const STATE_STATUS_MAP = {
//   submitted: ["Submitted"],
//   assigned: ["Assigned"],
//   inprogress: [
//     "In Progress",
//     "Awaiting User Response",
//     "User Respond Received",
//   ],
//   completed: ["Resolved", "Closed"],
// };

// export async function GET(req) {
//   try {
//     /* ── 1. auth ── */
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     if (!token)
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     /* ── 2. connect DB ── */
//     await database();

//     /* ── 3. role-based base query ── */
//     const query = {};

//     if (decoded.role === "User") {
//       query["user.userId"] = decoded.id;
//     }

//     if (decoded.role === "Department") {
//       if (!decoded.department) {
//         return NextResponse.json(
//           { success: false, message: "Department not assigned" },
//           { status: 403 },
//         );
//       }
//       query.assignedDept = decoded.department;
//     }

//     // Admin → no restriction, sees all tickets

//     /* ── 4. state filter ── */
//     const { searchParams } = new URL(req.url);
//     const state = searchParams.get("state");

//     if (state && state.toLowerCase() !== "all") {
//       const statuses = STATE_STATUS_MAP[state.toLowerCase()];

//       if (!statuses) {
//         return NextResponse.json(
//           { success: false, message: "Invalid state filter" },
//           { status: 400 },
//         );
//       }

//       query.status = { $in: statuses };
//     }

//     /* ── 5. date range filter (optional) ── */
//     const start = searchParams.get("start");
//     const end = searchParams.get("end");

//     if (start || end) {
//       query.createdAt = {};
//       if (start) {
//         const sdate = new Date(start);
//         if (!isNaN(sdate)) query.createdAt.$gte = sdate;
//       }
//       if (end) {
//         // include the whole end day
//         const ed = new Date(end);
//         if (!isNaN(ed)) {
//           ed.setHours(23, 59, 59, 999);
//           query.createdAt.$lte = ed;
//         }
//       }
//     }

//     /* ── 6. fetch ── */
//     const tickets = await TicketModel.find(query).sort({ createdAt: -1 }).lean();

//     return NextResponse.json({
//       success: true,
//       total: tickets.length,
//       state: state || "all",
//       tickets,
//     });
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return NextResponse.json(
//         { message: "Session expired, please login again" },
//         { status: 401 },
//       );
//     }

//     console.error("Error fetching tickets:", err);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch tickets" },
//       { status: 500 },
//     );
//   }
// }


export const dynamic = "force-dynamic";

// app/api/tickets/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import database from "@/lib/database";
import TicketModel from "@/models/Ticket.model";
import UserModel from "@/models/User.model";
import { PREDEFINED_TYPES } from "@/constants/ticketTypes";

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

export async function GET(req) {
  try {
    /* ── 1. auth ── */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ── 2. connect DB ── */
    await database();

    /* ── 3. role-based base query ── */
    const query = {};

    if (decoded.role === "User") {
      query["user.userId"] = decoded.id;
    }

    if (decoded.role === "Department") {
      if (!decoded.department) {
        return NextResponse.json(
          { success: false, message: "Department not assigned" },
          { status: 403 },
        );
      }
      query.assignedDept = decoded.department;
    }

    // Admin → no restriction, sees all tickets

    /* ── 4. state filter ── */
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");

    if (state && state.toLowerCase() !== "all") {
      const statuses = STATE_STATUS_MAP[state.toLowerCase()];

      if (!statuses) {
        return NextResponse.json(
          { success: false, message: "Invalid state filter" },
          { status: 400 },
        );
      }

      query.status = { $in: statuses };
    }

    /* ── 5. date range filter (optional) ── */
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (start || end) {
      query.createdAt = {};
      if (start) {
        const sdate = new Date(start);
        if (!isNaN(sdate)) query.createdAt.$gte = sdate;
      }
      if (end) {
        // include the whole end day
        const ed = new Date(end);
        if (!isNaN(ed)) {
          ed.setHours(23, 59, 59, 999);
          query.createdAt.$lte = ed;
        }
      }
    }

    /* ── 6. location filters (only for Admin) ── */
    const district = searchParams.get("district");
    const tehsil = searchParams.get("tehsil");
    const janpad = searchParams.get("janpad");
    const vidhansabha = searchParams.get("vidhansabha");
    const policeStation = searchParams.get("policeStation");
    const upTehsil = searchParams.get("upTehsil");
    const department = searchParams.get("department");
    const complaintType = searchParams.get("complaintType");

    // Only apply location filters for Admin
    if (decoded.role === "Admin") {
      let userFilter = {};
      
      if (district) userFilter.district = district;
      if (tehsil) userFilter.tehsil = tehsil;
      if (janpad) userFilter.janpad = janpad;
      if (vidhansabha) userFilter.vidhansabha = vidhansabha;
      if (policeStation) userFilter.policeStation = policeStation;
      if (upTehsil) userFilter.upTehsil = upTehsil;
      
      // If any location filter is applied, get matching user IDs
      if (Object.keys(userFilter).length > 0) {
        const matchingUsers = await UserModel.find(userFilter, { _id: 1 }).lean();
        const userIds = matchingUsers.map(u => u._id);
        
        if (userIds.length > 0) {
          query["user.userId"] = { $in: userIds };
        } else {
          // No matching users, return empty result
          return NextResponse.json({
            success: true,
            total: 0,
            state: state || "all",
            tickets: [],
          });
        }
      }
      
      // Department filter - assignedDept par lagega
      if (department) {
        query.assignedDept = department;
      }
      
      // ✅ Complaint Type filter - complaintType par lagega
       if (complaintType) {
        if (complaintType === "अन्य (Others)") {
          // Show tickets that are NOT in predefined types
          query.complaintType = { $nin: PREDEFINED_TYPES };
        } else {
          // Show tickets matching specific type
          query.complaintType = complaintType;
        }
      }
    }

    /* ── 7. fetch tickets ── */
    const tickets = await TicketModel.find(query).sort({ createdAt: -1 }).lean();

    /* ── 8. ✅ Fetch user details for all tickets ── */
    const userIds = tickets
      .map(t => t.user?.userId)
      .filter(Boolean);
    
    let userMap = {};
    if (userIds.length > 0) {
      const users = await UserModel.find(
        { _id: { $in: userIds } },
        { 
          _id: 1, 
          name: 1, 
          phone: 1, 
          address: 1, 
          district: 1, 
          tehsil: 1, 
          upTehsil: 1,
          janpad: 1, 
          vidhansabha: 1, 
          policeStation: 1, 
          sex: 1,
          voterId: 1,
          aadhar: 1,
          whatsapp: 1
        }
      ).lean();

      // Create user map for quick lookup
      userMap = {};
      users.forEach(u => {
        userMap[u._id.toString()] = u;
      });
    }

    /* ── 9. ✅ Attach userDetails to each ticket ── */
    const ticketsWithUser = tickets.map(ticket => {
      const userObj = ticket.user?.userId ? userMap[ticket.user.userId.toString()] : null;
      return {
        ...ticket,
        userDetails: userObj ? {
          name: userObj.name || ticket.user?.name || '',
          phone: userObj.phone || ticket.user?.phone || '',
          address: userObj.address || '',
          district: userObj.district || '',
          tehsil: userObj.tehsil || '',
          upTehsil: userObj.upTehsil || '',
          janpad: userObj.janpad || '',
          vidhansabha: userObj.vidhansabha || '',
          policeStation: userObj.policeStation || '',
          sex: userObj.sex || '',
          voterId: userObj.voterId || '',
          aadhar: userObj.aadhar || '',
          whatsapp: userObj.whatsapp || '',
        } : {
          name: ticket.user?.name || '',
          phone: ticket.user?.phone || '',
          address: '',
          district: '',
          tehsil: '',
          upTehsil: '',
          janpad: '',
          vidhansabha: '',
          policeStation: '',
          sex: '',
          voterId: '',
          aadhar: '',
          whatsapp: '',
        }
      };
    });

    return NextResponse.json({
      success: true,
      total: ticketsWithUser.length,
      state: state || "all",
      tickets: ticketsWithUser,
    });
    
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { message: "Session expired, please login again" },
        { status: 401 },
      );
    }

    console.error("Error fetching tickets:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}