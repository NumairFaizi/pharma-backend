import pool from "../db.js";

export const getBatches = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM batches");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
