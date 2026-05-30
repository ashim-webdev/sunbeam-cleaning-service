import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";
import Notice from "../models/notis.js";
import User from "../models/userModel.js";
import {
  emitEventCreated,
  emitEventUpdated,
  emitEventDeleted,
} from "../utils/socketEvents.js";


// CREATE EVENT (ADMIN ONLY)
export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, start, end, location } = req.body;

  if (!title || !description || !start || !end || !location) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const event = await Event.create({
    title,
    description,
    start,
    end,
    location,
    createdBy: req.user._id,
  });

  // GET EVERY USER EXCEPT CREATOR
  const users = await User.find({
    _id: { $ne: req.user._id },
  }).select("_id");

  const userIds = users.map((user) => user._id);

  // CREATE NOTIFICATION
  await Notice.create({
    team: userIds,
    text: `A new event was created.
      title: ${title}
      location: ${location}`,
    event: event._id,
    isRead: [],
    createdBy: req.user._id,
    sender: req.user._id,
    refId: event._id,
    refModel: "Event",
    // type: "event",
    
  });

  emitEventCreated(event);

  res.status(201).json(event);
});


// GET ALL EVENTS
export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({})
    .sort({ start: 1 });

  res.status(200).json(events);
});


// UPDATE EVENT (ADMIN ONLY)
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  event.title = req.body.title || event.title;
  event.description = req.body.description || event.description;
  event.start = req.body.start || event.start;
  event.end = req.body.end || event.end;
  event.location = req.body.location || event.location;

  const updatedEvent = await event.save();

  emitEventUpdated(updatedEvent);

  res.status(200).json(updatedEvent);
});


// DELETE EVENT (ADMIN ONLY)
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const eventId = event._id;

  await event.deleteOne();

  emitEventDeleted(eventId);

  res.status(200).json({
    status: true,
    message: "Event deleted successfully",
  });
});