import express from "express";

import * as controller from "../controllers/paymentLog.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE PUT /api/payment/:id
router.put("/payment/:id", middleware.auth, controller.update);

export default router;
