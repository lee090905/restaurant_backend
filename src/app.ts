import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running ✅" });
});

// Gắn router chính
app.use("/api", router);

export default app;
