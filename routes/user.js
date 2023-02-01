import express from "express";

import * as controller from "../controllers/user.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/users
router.get(
  "/users",
  middleware.auth,
  middleware.checkPermission("view user"),
  controller.index
);

export default router;
