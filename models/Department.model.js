import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    designation: { type: String, required: true },
    phone: { type: String, required: true },

    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
    },

    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Department ||
  mongoose.model("Department", departmentSchema);
