import express from "express";

import * as controller from "../controllers/service.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/products
router.get("/services", middleware.auth, controller.index);
router.get(
  "/service-by-category/:category",
  middleware.auth,
  controller.showbyCategory
);

export default router;
