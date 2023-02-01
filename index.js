import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import IndexRoute from "./routes/index.js";
import AuthRoute from "./routes/auth.js";
import UserRoute from "./routes/user.js";

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
app.use("/api", UserRoute);
app.use("/api/auth", AuthRoute);

app.listen(port, () => {
  console.log(`Node server is running on ${env.URL}:${port}`);
});
