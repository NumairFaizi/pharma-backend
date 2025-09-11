import express from "express";
import { getLecturesByCourse, addLecture, updateLecture, deleteLecture } from "../controllers/lectureController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/:courseId", getLecturesByCourse);
router.post("/:courseId", upload.single("video"), addLecture);
router.put("/:id", updateLecture);
router.delete("/:id", deleteLecture);

export default router;
