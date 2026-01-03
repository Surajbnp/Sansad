import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import database from "@/lib/database";
import UserModel from "@/models/User.model";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    await database();

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role, department : user.department },
      "sansadappsecret",
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        success: true,
        token,
        message: "Login successful.",
        user: {
          userId: user?._id,
          name: user?.name,
          email: user?.email,
          address: user?.address,
          sex: user?.sex,
          voterId: user?.voterId,
          aadhar: user?.aadhar,
          whatsapp: user?.whatsapp,
          role: user?.role,
          vidhansabha: user?.vidhansabha,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
