import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";


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

  res.status(200).json(updatedEvent);
});


// DELETE EVENT (ADMIN ONLY)
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  await event.deleteOne();

  res.status(200).json({
    status: true,
    message: "Event deleted successfully",
  });
});