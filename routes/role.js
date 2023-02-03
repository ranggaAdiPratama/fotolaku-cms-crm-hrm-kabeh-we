import express from "express";

import * as controller from "../controllers/role.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/roles
router.get(
  "/roles",
  middleware.auth,
  controller.index
);

export default router;