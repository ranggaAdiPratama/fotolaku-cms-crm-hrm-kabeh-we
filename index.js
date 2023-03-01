import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import IndexRoute from "./routes/index.js";
import AuthRoute from "./routes/auth.js";
import BackgroundRoute from "./routes/background.js";
import BrandRoute from "./routes/brand.js";
import CustomerRoute from "./routes/customer.js";
import ModelRoute from "./routes/model.js";
import OrderRoute from "./routes/order.js";
import PoseRoute from "./routes/pose.js";
import ServiceRoute from "./routes/service.js";
import PropertyRoute from "./routes/property.js";
import RatioRoute from "./routes/ratio.js";
import SalesRoute from "./routes/sales.js";
import ThemeRoute from "./routes/theme.js";
import UserRoute from "./routes/user.js";
import RoleRoute from "./routes/role.js";
import PermissionRoute from "./routes/permission.js";
import UserActivityRoute from "./routes/userActivity.js";
import ModuleRoute from "./routes/module.js";

dotenv.config();

const app = express();
const env = process.env;

const port = env.PORT || 8000;

mongoose
  .set("strictQuery", false)
  .connect(env.MONGO_DB_URL)
  .then(() => console.log("database connection established"))
  .catch((err) => console.log(`DB error => ${err}`));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", IndexRoute);
app.use("/api", BackgroundRoute);
app.use("/api", BrandRoute);
app.use("/api", CustomerRoute);
app.use("/api", ModelRoute);
app.use("/api", PoseRoute);
app.use("/api", OrderRoute);
app.use("/api", ServiceRoute);
app.use("/api", PropertyRoute);
app.use("/api", RatioRoute);
app.use("/api", UserRoute);
app.use("/api", RoleRoute);
app.use("/api", PermissionRoute);
app.use("/api", SalesRoute);
app.use("/api", ThemeRoute);
app.use("/api", UserActivityRoute);
app.use("/api", ModuleRoute);
app.use("/api/auth", AuthRoute);

app.listen(port, () => {
  console.log(`Node server is running on ${env.URL}:${port}`);
});
