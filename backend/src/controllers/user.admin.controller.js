import * as users from "../services/user.admin.service.js";

export const getAllUsers = async (req, res) => {
  const data = await users.getAll();
  res.json(data);
};

export const deleteUser = async (req, res) => {
  await users.remove(req.params.id);
  res.json({ success: true });
};
