import express from "express";

import * as controller from "../controllers/misc.js";

const router = express.Router();

// NOTE GET /
router.get("/", (_req, res) => {
  res.json({ message: "Welcome to the API" });
});
// NOTE GET /api/wapi-sender/restart
router.get("/api/wapi-sender/restart", controller.restartWapi);

export default router;
