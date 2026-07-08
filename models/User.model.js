import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
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
    },

    aadhar: {
      type: Number,
      unique: true,
      sparse: true,
    },

    vidhansabha: {
      type: String,
      required: function () {
        return this.role === "User";
      },
    },

    district: {
      type: String,
      required: function () {
        return this.role === "User";
      },
    },

    tehsil: {
      type: String,
      required: function () {
        return this.role === "User";
      },
    },
    upTehsil: {
      type: String,
      required: function () {
        return this.role === "User";
      },
    },

    janpad: {
      type: String,
      required: function () {
        return this.role === "User";
      },
    },

    // ✅ NEW FIELD - Police Station
    policeStation: {
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
  { timestamps: true },
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
