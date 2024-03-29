import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import IndexRoute from "./routes/index.js";
import AngleRoute from "./routes/angle.js";
import AuthRoute from "./routes/auth.js";
import BackgroundRoute from "./routes/background.js";
import BrandRoute from "./routes/brand.js";
import CustomerRoute from "./routes/customer.js";
import CustomerSalesRoute from "./routes/customerSales.js";
import FollowUpNotificationRoute from "./routes/followUpNotification.js";
import InvoiceRoute from "./routes/invoice.js";
import ModelRoute from "./routes/model.js";
import OrderRoute from "./routes/order.js";
import PoseRoute from "./routes/pose.js";
import ServiceRoute from "./routes/service.js";
import PaymentLogRoute from "./routes/paymentLog.js";
import ProjectRoute from "./routes/project.js";
import PropertyRoute from "./routes/property.js";
import ProductTypeRoute from "./routes/productType.js";
import RatioRoute from "./routes/ratio.js";
import SalesRoute from "./routes/sales.js";
import ThemeRoute from "./routes/theme.js";
import UserRoute from "./routes/user.js";
import RoleRoute from "./routes/role.js";
import PermissionRoute from "./routes/permission.js";
import StaffRoute from "./routes/staff.js";
import UserActivityRoute from "./routes/userActivity.js";
import UserSourceRoute from "./routes/userSource.js";
import ModuleRoute from "./routes/module.js";
import TripayOrderRoute from "./routes/tripayOrder.js";

dotenv.config();

const app = express();
const env = process.env;

const port = env.PORT || 8000;

mongoose
  .set("strictQuery", false)
  .connect(env.MONGO_DB_URL)
  .then(() => console.log("database connection established"))
  .catch((err) => console.log(`DB error => ${err}`));

const corsOptions = {
  origin: true,
  credentials: true,
  maxAge: 3600,
};

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", IndexRoute);
app.use("/api", AngleRoute);
app.use("/api", BackgroundRoute);
app.use("/api", BrandRoute);
app.use("/api", CustomerRoute);
app.use("/api", CustomerSalesRoute);
app.use("/api", FollowUpNotificationRoute);
app.use("/api", InvoiceRoute);
app.use("/api", ModelRoute);
app.use("/api", PoseRoute);
app.use("/api", OrderRoute);
app.use("/api", ServiceRoute);
app.use("/api", PropertyRoute);
app.use("/api", RatioRoute);
app.use("/api", UserRoute);
app.use("/api", RoleRoute);
app.use("/api", PermissionRoute);
app.use("/api", ProductTypeRoute);
app.use("/api", SalesRoute);
app.use("/api", ThemeRoute);
app.use("/api", UserActivityRoute);
app.use("/api", ModuleRoute);
app.use("/api", PaymentLogRoute);
app.use("/api", ProjectRoute);
app.use("/api", StaffRoute);
app.use("/api", UserSourceRoute);
app.use("/api", TripayOrderRoute);
app.use("/api/auth", AuthRoute);

app.listen(port, () => {
  console.log(`Node server is running on ${env.URL}:${port}`);
});
