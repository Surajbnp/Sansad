// import { NextResponse } from "next/server";
// import database from "@/lib/database";
// import UserModel from "@/models/User.model";
// import { ROLES } from "@/constants/roles";

// export async function POST(req) {
//   try {
//     await database.connect();
//     const { name, phone, permissions, otp } = await req.json();

//     // Validate input
//     if (!name || !phone || !permissions || permissions.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Verify OTP (implement your logic)
//     // const isValidOTP = await verifyOTP(phone, otp);
//     // if (!isValidOTP) {
//     //   return NextResponse.json(
//     //     { success: false, message: "Invalid OTP" },
//     //     { status: 400 }
//     //   );
//     // }

//     // Check if user already exists
//     const existingUser = await UserModel.findOne({ phone });
//     if (existingUser) {
//       return NextResponse.json(
//         { success: false, message: "Phone number already registered" },
//         { status: 409 }
//       );
//     }

//     // Create sub-admin
//     const newSubAdmin = await UserModel.create({
//       name,
//       phone,
//       role: ROLES.SUB_ADMIN,
//       permissions,
//       // Set required User fields as null or default
//       address: null,
//       sex: null,
//       voterId: null,
//       aadhar: null,
//       vidhansabha: null,
//       district: null,
//       tehsil: null,
//       upTehsil: null,
//       janpad: null,
//       policeStation: null,
//     });

//     return NextResponse.json(
//       { 
//         success: true, 
//         message: "Sub-admin created successfully",
//         user: newSubAdmin 
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating sub-admin:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to create sub-admin" },
//       { status: 500 }
//     );
//   }
// }