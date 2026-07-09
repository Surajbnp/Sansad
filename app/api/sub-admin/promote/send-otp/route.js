// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import { ROLES } from "@/constants/roles";

// const otpStore = new Map();

// export async function POST(req) {
//   try {
//     const token = await getToken({ req });
    
//     if (!token || token.role !== ROLES.ADMIN) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     const adminPhone = token.phone;
//     if (!adminPhone) {
//       return NextResponse.json(
//         { success: false, message: "Admin phone number not found" },
//         { status: 400 }
//       );
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
    
//     // Store OTP with expiry
//     otpStore.set(adminPhone, {
//       otp,
//       expiresAt: Date.now() + 5 * 60 * 1000
//     });

//     // Send OTP via SMS
//     // await sendSMS(adminPhone, `Your OTP for promotion is: ${otp}`);

//     console.log(`Promotion OTP for ${adminPhone}: ${otp}`);

//     return NextResponse.json({ 
//       success: true, 
//       message: "OTP sent to your registered number" 
//     });
//   } catch (error) {
//     console.error("Error sending promotion OTP:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Failed to send OTP" },
//       { status: 500 }
//     );
//   }
// }