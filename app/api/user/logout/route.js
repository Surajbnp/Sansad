export const dynamic = "force-dynamic";

// app/api/auth/logout/route.js

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    { success: true, message: "Logged out" },
    { status: 200 },
  );

  // clear the token cookie by setting maxAge to 0
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return res;
}
