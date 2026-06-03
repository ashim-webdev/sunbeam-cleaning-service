import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    property: {
      type: String,
      required: true,
    },

    service: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;