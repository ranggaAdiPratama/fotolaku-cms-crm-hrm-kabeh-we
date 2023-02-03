import express from "express";

import * as controller from "../controllers/product.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/products
router.get("/products", middleware.auth, controller.index);

export default router;
