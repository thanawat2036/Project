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

/* ===== USERS ===== */
export const getAllUsers = async (req, res) => {
  const data = await admin.getUsers();
  res.json(data);
};

export const removeUser = async (req, res) => {
  await admin.deleteUser(req.params.id);
  res.json({ success: true });
};

/* ===== TABLES CLOSE ===== */
export const closeTableByDate = async (req, res) => {
  const { table_no, date } = req.body;
  await admin.closeTable(table_no, date);
  res.json({ success: true });
};

export const openTableByDate = async (req, res) => {
  const { table_no, date } = req.body;
  await admin.openTable(table_no, date);
  res.json({ success: true });
};
/* ===== MESSAGES ===== */
export const getAllMessages = async (req, res) => {
  const data = await admin.getMessages();
  res.json(data);
};

export const sendReply = async (req, res) => {
  await admin.replyMessage(req.params.id, req.body.reply);
  res.json({ success: true });
};
