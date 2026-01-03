import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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

    name: {
      type: String,
      trim: true,
    },

    /* ================= USER-ONLY FIELDS ================= */

    address: {
      type: String,
      required: function () {
        return this.role === "User";
      },
    },

    sex: {
      type: String,
      required: function () {
        return this.role === "User";
      },
    },

    voterId: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return this.role === "User";
      },
    },

    aadhar: {
      type: Number,
      unique: true,
      sparse: true,
      required: function () {
        return this.role === "User";
      },
    },

    vidhansabha: {
      type: String,
      required: function () {
        return this.role === "User";
      },
    },

    whatsapp: {
      type: Number,
    },

    /* ================= ROLE & ACCESS ================= */

    role: {
      type: String,
      enum: ["User", "Admin", "Department"],
      default: "User",
      index: true,
    },

    // Only meaningful for Department role
    department: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
