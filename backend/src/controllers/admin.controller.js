import * as admin from "../services/admin.service.js";

/* BOOKINGS */
export const getAllBookings = async (req, res) => {
  try {
    const data = await admin.getBookings();
    res.json(data);
  } catch (err) {
    console.error("getAllBookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    await admin.cancelBooking(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("cancelBooking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* TABLES */
export const getTables = async (req, res) => {
  try {
    const data = await admin.getTables();
    res.json(data);
  } catch (err) {
    console.error("getTables:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const openTable = async (req, res) => {
  await admin.updateTableStatus(req.params.id, "open");
  res.json({ success: true });
};

export const closeTable = async (req, res) => {
  await admin.updateTableStatus(req.params.id, "closed");
  res.json({ success: true });
};
