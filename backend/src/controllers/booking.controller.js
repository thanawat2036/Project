import * as service from "../services/booking.service.js";

export const createBooking = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  await service.create(req.body, userId);
  res.json({ message: "จองโต๊ะสำเร็จ" });
};

export const myBookings = async (req, res) => {
  const userId = req.session.userId;
  const data = await service.findByUser(userId);
  res.json(data);
};

export const cancelBooking = async (req, res) => {
  const userId = req.session.userId;
  await service.cancel(req.params.id, userId);
  res.json({ message: "ยกเลิกการจองแล้ว" });
};

export const getBookedTables = async (req, res) => {
  const { date, time } = req.query;

  const result = await service.findBookedTables(date, time);
  res.json(result);
};