import * as booking from "../services/booking.service.js";

export const getBookedTables = async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.json([]);
  }

  const tables = await booking.findBookedTables(date, time);
  res.json(tables); // [1,2,5]
};

export const createBooking = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "กรุณาเข้าสู่ระบบก่อน" });
  }

  try {
    await booking.create({
      user_id: req.session.userId,
      date: req.body.date,
      time: req.body.time,
      table_no: req.body.table_no,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const myBookings = async (req, res) => {
  const rows = await booking.findByUser(req.session.userId);
  res.json(rows);
};

export const cancelBooking = async (req, res) => {
  try {
    await booking.cancel(req.params.id, req.session.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
