// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import { ROLES } from "@/constants/roles";
// import { getToken } from "next-auth/jwt";

// export async function POST(req) {
//   try {
//     await dbConnect();
    
//     // Get current admin user
//     const token = await getToken({ req });
//     if (!token || token.role !== ROLES.ADMIN) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     const { userId, otp } = await req.json();

//     if (!userId || !otp) {
//       return NextResponse.json(
//         { success: false, message: "User ID and OTP are required" },
//         { status: 400 }
//       );
//     }

//     // Verify OTP for admin (implement your logic)
//     // const isValidOTP = await verifyOTP(token.phone, otp);
//     // if (!isValidOTP) {
//     //   return NextResponse.json(
//     //     { success: false, message: "Invalid OTP" },
//     //     { status: 400 }
//     //   );
//     // }

//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     if (user.role !== ROLES.SUB_ADMIN) {
//       return NextResponse.json(
//         { success: false, message: "User is not a sub-admin" },
//         { status: 400 }
//       );
//     }

//     // Promote to Admin
//     user.role = ROLES.ADMIN;
//     user.permissions = []; // Admin gets all permissions via logic
//     await user.save();

//     return NextResponse.json({ 
//       success: true, 
//       message: `${user.name} has been promoted to Admin` 
//     });
//   } catch (error) {
//     console.error("Error promoting sub-admin:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to promote user" },
//       { status: 500 }
//     );
//   }
// }