import express from "express";

import * as controller from "../controllers/customer.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/customers
router.get("/customers", middleware.auth, controller.index);

export default router;
