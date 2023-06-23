import express from "express";

import * as controller from "../controllers/customerSales.js";
import * as middleware from "../middleware.js";

const router = express.Router();

// NOTE GET /api/sales-outbound
router.get("/sales-outbound", middleware.auth, controller.index);
// NOTE GET /api/sales-outbound
router.get("/sales-outbound-me", middleware.auth, controller.personalCustomer);
// NOTE GET /api/sales-outbound/:id
router.get("/sales-outbound/:id", middleware.auth, controller.show);
// NOTE POST /api/sales-outbound/add/:id
router.post("/sales-outbound/add/:id", middleware.auth, controller.add);
// NOTE POST /api/sales-outbound/delete/:id
router.post(
  "/sales-outbound/delete/:id",
  middleware.auth,
  controller.deleteCustomer
);
// NOTE POST /api/sales-outbound/set/:id
router.post("/sales-outbound/set/:id", middleware.auth, controller.setCustomer);
// NOTE PUT /api/sales-outbound/fu
router.put("/sales-outbound/fu", middleware.auth, controller.followUp);

export default router;
