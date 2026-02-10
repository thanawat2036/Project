import * as booking from "../services/booking.service.js";

/* ===============================
   CREATE BOOKING
================================ */
export const createBooking = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await booking.create(req.body, req.session.userId);
    res.json({ success: true });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ===============================
   GET MY BOOKINGS
================================ */
export const getMyBookings = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = await booking.findByUser(req.session.userId);
  res.json(data);
};

/* ===============================
   CANCEL BOOKING
================================ */
export const cancelBooking = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await booking.cancel(req.params.id, req.session.userId);
  res.json({ success: true });
};

/* ===============================
   GET BOOKED TABLES (ปิดทั้งวัน)
================================ */
export const getBookedTables = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "date is required" });
  }

  // ❗ ไม่สนเวลา → ถ้าจองวันนั้น ปิดทั้งวัน
  const tables = await booking.getBookedTables(date);
  res.json(tables);
};
