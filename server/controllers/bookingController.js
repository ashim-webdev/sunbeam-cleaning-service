import Booking from "../models/bookingModel.js";
import Notice from "../models/notis.js";
import User from "../models/userModel.js";
import {
  emitBookingCreated,
  emitBookingUpdated,
  emitBookingDeleted,
} from "../utils/socketEvents.js";

export const createBooking = async (req, res) => {
  try {
    const {
      clientName,
      phoneNumber,
      property,
      service,
      address,
      lat,
      lng,
    } = req.body;


    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "bookings" },
              (error, result) => {
                if (error) reject(error);

                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              }
            );

            stream.end(file.buffer);
          })
      );

      imageUrls = await Promise.all(uploadPromises);
    }

    const booking = await Booking.create({
      clientName,
      phoneNumber,
      property,
      service,
      address,
      lat,
      lng,
      images: imageUrls,
    });

    // find all admins
    const admins = await User.find({
      isAdmin: true,
    }).select("_id");

    const adminIds = admins.map(
      (admin) => admin._id
    );

    // create notification
    const notification = await Notice.create({
      team: adminIds,

      text: `New booking request from ${clientName}
    Service: ${service}
    Property: ${property}
    Phone: ${phoneNumber}`,

      refId: booking._id,

      refModel: "Booking",

      notificationType: "booking",

      type: "alert",
    });

    emitBookingCreated({ 
      booking,
      recipients: adminIds,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";

    const searchQuery = search
      ? {
          $or: [
            { clientName: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
            { service: { $regex: search, $options: "i" } },
            { property: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const totalBookings = await Booking.countDocuments(searchQuery);

    const bookings = await Booking.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      bookings,
      page,
      totalPages: Math.ceil(totalBookings / limit),
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = req.body.status;

    await booking.save();

    const admins = await User.find({
      isAdmin: true,
    }).select("_id");

    const adminIds = admins.map(
      (admin) => admin._id
    );

    emitBookingUpdated({
      booking,
      recipients: adminIds,
    });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.clientName =
      req.body.clientName || booking.clientName;

    booking.phoneNumber =
      req.body.phoneNumber || booking.phoneNumber;

    booking.property =
      req.body.property || booking.property;

    booking.service =
      req.body.service || booking.service;

    booking.address =
      req.body.address || booking.address;

    await booking.save();
    
    const admins = await User.find({
      isAdmin: true,
    }).select("_id");
    
    const adminIds = admins.map(
      (admin) => admin._id
    );
    
    await Notice.create({
      team: adminIds,

      text: `Booking updated ✅
    Client: ${booking.clientName}
    Service: ${booking.service}
    Property: ${booking.property}
    Phone: ${booking.phoneNumber}`,

      refId: booking._id,

      refModel: "Booking",

      notificationType: "booking",

      type: "alert",
    });

    emitBookingUpdated({
      booking,
      recipients: adminIds,
    });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const admins = await User.find({
      isAdmin: true,
    }).select("_id");

    const adminIds = admins.map(
      (admin) => admin._id
    );

    for (const image of booking.images) {
      await cloudinary.uploader.destroy(
        image.public_id
      );
    }
    
    await Notice.create({
      team: adminIds,

      text: `Booking deleted ❌
    Client: ${booking.clientName}
    Service: ${booking.service}
    Property: ${booking.property}
    Phone: ${booking.phoneNumber}`,

      refId: booking._id,

      refModel: "Booking",

      notificationType: "booking",

      type: "alert",
    });

    await booking.deleteOne();
    
    emitBookingDeleted({
      bookingId: booking._id,
      recipients: adminIds,
    });

    res.status(200).json({
      message: "Booking removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};