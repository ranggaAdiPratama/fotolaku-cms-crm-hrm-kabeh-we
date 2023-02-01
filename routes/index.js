import express from "express";

const router = express.Router();

// NOTE GET /
router.get("/", (_req, res) => {
  res.json({ message: "Welcome to the API" });
});

export default router;
