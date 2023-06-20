import express from "express";

import * as controller from "../controllers/tripayOrder.js";

const router = express.Router();

// NOTE GET /api/tripay/channels
router.get("/tripay/channels", controller.channel);
// NOTE GET /api/tripay/detail-order
router.get("/tripay/detail-order", controller.detailOrder);
// NOTE GET /api/tripay/fee-calculator
router.get("/tripay/fee-calculator", controller.calculator);
// NOTE POST /api/tripay/order
router.post("/tripay/order", controller.order);
// NOTE POST /api/tripay/callback
router.post("/tripay/callback", controller.callback);

export default router;
