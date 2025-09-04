import database from "@/lib/database";
import UserModel from "@/models/User.model";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, address, sex, email, voterId, whatsapp, password, vidhansabha } = body;
    const aadhar = body?.aadhar ? Number(body.aadhar) : null;

    await database();
    const query = {
      $or: [{ email }, { aadhar }],
    };

    if (voterId) {
      query.$or.push({ voterId });
    }

    const existingUser = await UserModel.findOne(query);

    if (existingUser) {
      let reason = "";
      if (existingUser.email === email) reason = "यह ईमेल पहले से पंजीकृत है।";
      else if (existingUser.aadhar === aadhar)
        reason = "यह आधार पहले से पंजीकृत है।";
      else if (voterId && existingUser.voterId === voterId)
        reason = "यह वोटर ID पहले से पंजीकृत है।";
      else reason = "User already exists.";

      return NextResponse.json(
        { success: false, message: reason },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      address,
      sex,
      email,
      voterId,
      aadhar: Number(aadhar),
      whatsapp: Number(whatsapp) || null,
      password: hashedPassword,
      vidhansabha,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup failed:", error.message);
    return NextResponse.json(
      { success: false, message: "Signup failed", error: error.message },
      { status: 500 }
    );
  }
}

// adding ticket creation route
// Schema ->
