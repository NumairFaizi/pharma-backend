import pool from "../db.js";
import fs from "fs";

export const getLecturesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await pool.query("SELECT * FROM lectures WHERE course_id = $1", [courseId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    const video_url = `/uploads/videos/${req.file.filename}`;

    const result = await pool.query(
      "INSERT INTO lectures (course_id, title, video_url) VALUES ($1, $2, $3) RETURNING *",
      [courseId, title, video_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const result = await pool.query(
      "UPDATE lectures SET title = $1 WHERE id = $2 RETURNING *",
      [title, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Lecture not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the video file before deleting
    const findResult = await pool.query("SELECT video_url FROM lectures WHERE id = $1", [id]);
    if (findResult.rows.length === 0) return res.status(404).json({ error: "Lecture not found" });

    const videoPath = `.${findResult.rows[0].video_url}`;

    // Delete from DB
    await pool.query("DELETE FROM lectures WHERE id = $1", [id]);

    // Delete file (optional)
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    res.json({ message: "Lecture deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
