import express from "express";

import * as controller from "../controllers/order.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE POST /api/order
router.post(
  "/order",
  middleware.auth,
  middleware.checkPermission("add crud card"),
  controller.store
);
// NOTE GET /api/order-status
router.get(
  "/order-status",
  middleware.auth,
  middleware.checkMultiplePermission(
    "view all crud card",
    "view own crud card"
  ),
  controller.statusList
);

export default router;
