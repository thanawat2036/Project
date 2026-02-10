import db from "../config/db.js";

export const findAll = async () => {
  const { rows } = await db.query(
    "SELECT * FROM promotions ORDER BY id DESC"
  );
  return rows;
};

export const create = async ({ title, detail, image }) => {
  await db.query(
    `INSERT INTO promotions (title, detail, image)
     VALUES ($1,$2,$3)`,
    [title, detail, image]
  );
};
