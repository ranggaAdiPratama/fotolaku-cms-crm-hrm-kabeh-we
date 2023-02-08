import moment from "moment";

import UserActivity from "../models/userActivity.js";

import * as helper from "../helper.js";
// SECTION list activities
export const index = async (req, res) => {
  try {
    const today = moment().startOf("day");

    const data = await UserActivity.find({
      createdAt: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    })
      .populate("user", "_id name")
      .sort("createdAt");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION list activities
// SECTION filter activities
export const filter = async (req, res) => {
  try {
    const { start, end } = req.body;

    if (!start) return helper.response(res, 400, "Start is required");

    let data = null;

    if (end) {
      data = await UserActivity.find({
        createdAt: {
          $gte: moment(start).toDate(),
          $lte: moment(end).endOf("day").toDate(),
        },
      })
        .populate("user", "_id name")
        .sort("createdAt");
    } else {
      data = await UserActivity.find({
        createdAt: {
          $gte: moment(start).toDate(),
          $lte: moment(start).endOf("day").toDate(),
        },
      })
        .populate("user", "_id name")
        .sort("createdAt");
    }

    if (!data) return helper.response(res, 400, "Data not found");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION filter activities
