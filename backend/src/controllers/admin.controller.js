import * as admin from "../services/admin.service.js";

/* ===== BOOKINGS ===== */
export const getAllBookings = async (req, res) => {
  try {
    const data = await admin.getAllBookings();
    res.json(data);
  } catch (err) {
    console.error("getAllBookings error:", err);
    res.status(500).json({ message: "โหลดข้อมูลการจองไม่สำเร็จ" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    await admin.cancelBooking(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("cancelBooking error:", err);
    res.status(500).json({ message: "ยกเลิกการจองไม่สำเร็จ" });
  }
};

/* ===== TABLES ===== */
export const getTables = async (req, res) => {
  try {
    const data = await admin.getTables();
    res.json(data);
  } catch (err) {
    console.error("getTables error:", err);
    res.status(500).json({ message: "โหลดข้อมูลโต๊ะไม่สำเร็จ" });
  }
};

export const openTable = async (req, res) => {
  try {
    await admin.updateTableStatus(req.params.id, "open");
    res.json({ success: true });
  } catch (err) {
    console.error("openTable error:", err);
    res.status(500).json({ message: "เปิดโต๊ะไม่สำเร็จ" });
  }
};

export const closeTable = async (req, res) => {
  try {
    await admin.updateTableStatus(req.params.id, "closed");
    res.json({ success: true });
  } catch (err) {
    console.error("closeTable error:", err);
    res.status(500).json({ message: "ปิดโต๊ะไม่สำเร็จ" });
  }
};
