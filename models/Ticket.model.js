import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      name: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
    },

    phone: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Assigned",
        "In-Progress",
        "Awaiting User Response",
        "Resolved",
        "Closed",
      ],
      default: "Submitted",
    },

    assignedDept: {
      type: String,
      ref: "Department",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "Submitted",
            "Assigned",
            "In Progress",
            "Awaiting User Response",
            "Resolved",
            "Closed",
          ],
          required: true,
        },
        updatedBy: {
          userId: { type: String, required: true },
          name: { type: String, required: true },
          role: {
            type: String,
            enum: ["User", "Admin", "Department"],
            required: true,
            default: "User",
          },
        },
        remarks: { type: String, trim: true },
        date: { type: Date, default: Date.now },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.pre("save", function (next) {
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      updatedBy: {
        userId: this.user.userId,
        name: this.user.name,
        role: this.user.role,
        updatedAt: new Date(),
      },
      updatedByModel: "User",
      remarks: "Ticket created",
    });
  }

  this.lastUpdated = Date.now();
  next();
});

const TicketModel =
  mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default TicketModel;
