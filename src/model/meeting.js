import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    buildingCode: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    discussion: {
      type: String,
      required: true,
    },

    meetingDate: {
      type: Date,
      required: true,
    },

    attendance: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Member",
          required: true,
        },
        present: {
          type: Boolean,
          default: false,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const meetingModel = mongoose.model("Meeting", meetingSchema);
export default meetingModel;
