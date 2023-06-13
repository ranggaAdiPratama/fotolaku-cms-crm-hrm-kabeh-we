import express from "express";

import * as controller from "../controllers/tripayOrder.js";

const router = express.Router();

// NOTE POST /api/tripay/order
router.post("/tripay/order", controller.order);
router.post("/tripay/callback", controller.callback);

export default router;
