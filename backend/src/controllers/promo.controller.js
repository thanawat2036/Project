import * as promo from "../services/promo.service.js";

export const getAll = async (req, res) => {
  const data = await promo.findAll();
  res.json(data);
};

export const create = async (req, res) => {
  const { title, detail } = req.body;

  if (!title || !detail) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  await promo.create({ title, detail, image: null });
  res.json({ success: true });
};
