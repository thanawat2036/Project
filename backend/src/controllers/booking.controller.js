import * as booking from "../services/booking.service.js";

export const bookedTables = async (req, res) => {
  const tables = await booking.getBookedTables(req.query);
  res.json(tables);
};

export const book = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Login required" });

  await booking.bookTable({
    userId: req.session.userId,
    ...req.body
  });

  res.json({ success: true });
};
