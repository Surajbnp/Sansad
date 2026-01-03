import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import database from "@/lib/database";
import DepartmentModel from "@/models/Department.model";
import UserModel from "@/models/User.model";
import verifyUser from "../../authMiddleware";

/* ------------------ slug generator ------------------ */
const generateSlug = async (name) => {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 1;

  while (await DepartmentModel.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

export async function POST(req) {
  try {
    await database();

    /* ------------------ AUTH ------------------ */
    const token = req.headers.get("authorization");
    const decoded = verifyUser(token);

    if (!decoded?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await UserModel.findById(decoded.userId);

    if (!admin || admin.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can create departments" },
        { status: 403 }
      );
    }

    /* ------------------ BODY ------------------ */
    const body = await req.json();
    const {
      name,
      assignedName,
      assignedEmail,
      assignedPassword,
      assignedContact,
    } = body;

    if (!name || !assignedName || !assignedEmail || !assignedPassword) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ------------------ CHECK DEPT ------------------ */
    const existingDept = await DepartmentModel.findOne({ name });
    if (existingDept) {
      return NextResponse.json(
        { success: false, message: "Department already exists" },
        { status: 409 }
      );
    }

    /* ------------------ CHECK USER ------------------ */
    const existingUser = await UserModel.findOne({ email: assignedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Department user already exists" },
        { status: 409 }
      );
    }

    /* ------------------ CREATE USER ------------------ */
    const hashedPassword = await bcrypt.hash(assignedPassword, 10);

    const deptUser = await UserModel.create({
      name: assignedName,
      email: assignedEmail,
      password: hashedPassword,
      whatsapp: assignedContact || null,
      role: "Department",
      department: name,
    });

    /* ------------------ CREATE DEPARTMENT ------------------ */
    const slug = await generateSlug(name);

    const department = await DepartmentModel.create({
      name,
      slug,
      createdBy: {
        userId: admin._id,
        name: admin.name,
      },
      assignedUser: deptUser._id,
    });

    return NextResponse.json({ success: true, department }, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
