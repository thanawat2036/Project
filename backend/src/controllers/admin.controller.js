import * as admin from "../services/admin.service.js";

/* ===== BOOKINGS ===== */
export const getAllBookings = async (req, res) => {
  const data = await admin.getAllBookings();
  res.json(data);
};

export const cancelBooking = async (req, res) => {
  await admin.cancelBooking(req.params.id);
  res.json({ success: true });
};

/* ===== TABLES ===== */
export const getTables = async (req, res) => {
  const data = await admin.getTables();
  res.json(data);
};

export const openTable = async (req, res) => {
  await admin.updateTableStatus(req.params.id, "open");
  res.json({ success: true });
};

export const closeTable = async (req, res) => {
  await admin.updateTableStatus(req.params.id, "closed");
  res.json({ success: true });
};
