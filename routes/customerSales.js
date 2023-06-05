import express from "express";

import * as controller from "../controllers/customerSales.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/customer-sales/:id
router.get("/customer-sales/:id", middleware.auth, controller.index);
// NOTE POST /api/customer-sales/add/:id
router.post("/customer-sales/add/:id", middleware.auth, controller.add);
// NOTE POST /api/customer-sales/delete/:id
router.post(
  "/customer-sales/delete/:id",
  middleware.auth,
  controller.deleteCustomer
);

export default router;
