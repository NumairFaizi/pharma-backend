import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import courseRoutes from "./routes/courses.js";
import userRoutes from "./routes/users.js";
import batchRoutes from "./routes/batches.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/batches", batchRoutes);

app.get("/", (req, res) => res.send("Pharma Backend API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
