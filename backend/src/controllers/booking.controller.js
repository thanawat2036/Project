import * as service from "../services/booking.service.js";

/* =========================
   GET BOOKED TABLES
========================= */
export const bookedTables = async (req, res, next) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({
        message: "date และ time จำเป็นต้องส่งมา",
      });
    }

    const tables = await service.getBookedTables({ date, time });
    res.json(tables);
  } catch (err) {
    next(err);
  }
};

/* =========================
   BOOK TABLE
========================= */
export const bookTable = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    await service.createBooking(userId, req.body);

    res.json({ message: "booking success" });
  } catch (err) {
    next(err);
  }
};
