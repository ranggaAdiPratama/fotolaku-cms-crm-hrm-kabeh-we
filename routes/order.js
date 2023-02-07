import express from "express";

import * as controller from "../controllers/order.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/orders
router.get(
  "/orders",
  middleware.auth,
  middleware.checkMultiplePermission(
    "view all crud card",
    "view own crud card"
  ),
  controller.index
);
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
// NOTE PUT /api/order/:id
router.put(
  "/order/:id",
  middleware.auth,
  middleware.checkMultiplePermission(
    "view all crud card",
    "view own crud card"
  ),
  controller.update
);

export default router;