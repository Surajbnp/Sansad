// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import { ROLES } from "@/constants/roles";

// export async function PUT(req) {
//   try {
//     await dbConnect();
//     const { userId, name, permissions, otp } = await req.json();

//     if (!userId || !name || !permissions || permissions.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Verify OTP (implement your logic)
//     // const user = await UserModel.findById(userId);
//     // const isValidOTP = await verifyOTP(user.phone, otp);
//     // if (!isValidOTP) {
//     //   return NextResponse.json(
//     //     { success: false, message: "Invalid OTP" },
//     //     { status: 400 }
//     //   );
//     // }

//     const updatedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       { 
//         name, 
//         permissions,
//         updatedAt: new Date()
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json(
//         { success: false, message: "Sub-admin not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: "Sub-admin updated successfully",
//       user: updatedUser 
//     });
//   } catch (error) {
//     console.error("Error updating sub-admin:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to update sub-admin" },
//       { status: 500 }
//     );
//   }
// }