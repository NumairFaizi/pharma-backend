import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos"); // folder to save videos
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname) // unique name: timestamp.mp4
    );
  },
});

// File filter (only video formats)
const fileFilter = (req, file, cb) => {
  const allowed = [".mp4", ".mov", ".avi", ".mkv"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
