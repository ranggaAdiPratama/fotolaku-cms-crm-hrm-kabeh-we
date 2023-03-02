import express from "express";

import * as controller from "../controllers/productType.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/product-types
router.get("/product-types", middleware.auth, controller.index);

export default router;
