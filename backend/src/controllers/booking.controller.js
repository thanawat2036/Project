import * as booking from "../services/booking.service.js";

export const createBooking = async (req, res, next) => {
  try {
    if (!req.session.userId)
      return res.status(401).json({ message: "Unauthorized" });

    await booking.create(req.body, req.session.userId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getBookedTables = async (req, res) => {
  const { date, time } = req.query;
  res.json(await booking.getBookedTables(date, time));
};
