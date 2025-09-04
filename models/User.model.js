import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    address: { type: String },
    sex: { type: String },
    voterId: { type: String, unique: true, sparse: true },
    aadhar: { type: Number, required: true, unique: true },
    whatsapp: { type: Number },
    vidhansabha: { type: String, required: true },
    role: {
      type: String,
      enum: ["User", "Admin", "Department"],
      default: "User",
    },
    department: { type: String, default: null },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
