import * as booking from "../services/booking.service.js";

export const createBooking = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });

  await booking.create(req.body, req.session.userId);
  res.json({ success: true });
};

export const getMyBookings = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });

  const data = await booking.findByUser(req.session.userId);
  res.json(data);
};

export const cancelBooking = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Unauthorized" });

  await booking.cancel(req.params.id, req.session.userId);
  res.json({ success: true });
};

export const getBookedTables = async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.json([]);
  }

  const tables = await bookingService.findBookedTables(date, time);
  res.json(tables);
};

