import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      name: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
    },
    assignedTo: {
      name: { type: String, required: true },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      contact: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

const DepartmentModel =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);

export default DepartmentModel;
