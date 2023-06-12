import FollowUpNotification from "../models/followUpNotification.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

import moment from "moment";
// SECTION list
export const index = async (req, res) => {
  try {
    let userOnWarning = 0;
    let ids = [];

    let exception = await FollowUpNotification.countDocuments({
      createdAt: {
        $gte: moment().startOf("day").toDate(),
        $lte: moment().endOf("day").toDate(),
      },
    });

    if (exception > 0) {
      exception = await FollowUpNotification.find({
        createdAt: {
          $gte: moment().startOf("day").toDate(),
          $lte: moment().endOf("day").toDate(),
        },
      });

      exception.map((row) => {
        ids.push(row.user);
      });

      userOnWarning = await User.countDocuments({
        follow_up_at: {
          $gte: moment().startOf("day").toDate(),
          $lte: moment().endOf("day").toDate(),
        },
        $and: [
          {
            _id: {
              $nin: ids,
            },
          },
          {
            is_contacted: false,
          },
        ],
      });
    } else {
      userOnWarning = await User.countDocuments({
        follow_up_at: {
          $gte: moment().startOf("day").toDate(),
          $lte: moment().endOf("day").toDate(),
        },
      });
    }

    if (userOnWarning > 0) {
      if (exception > 0) {
        userOnWarning = await User.find({
          follow_up_at: {
            $gte: moment().startOf("day").toDate(),
            $lte: moment().endOf("day").toDate(),
          },
          $and: [
            {
              _id: {
                $nin: ids,
              },
            },
            {
              is_contacted: false,
            },
          ],
        });
      } else {
        userOnWarning = await User.find({
          follow_up_at: {
            $gte: moment().startOf("day").toDate(),
            $lte: moment().endOf("day").toDate(),
          },
          $and: [
            {
              is_contacted: false,
            },
          ],
        });
      }

      userOnWarning.map(async (user) => {
        FollowUpNotification.create({
          text: `Mohon follow up customer atas nama ${user.name}, nomor hp: ${user.phone}`,
          deadline: user.follow_up_at,
          user: user._id,
          on: true,
        });
      });
    }

    const data = await FollowUpNotification.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name phone")
      .populate("done_by", "name phone");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
// SECTION selesaikan follow up
export const done = async (req, res) => {
  try {
    const id = req.params.id;
    let data;

    let notification = await FollowUpNotification.findById(id, {});

    switch (true) {
      case !notification:
        return helper.response(res, 400, "Data not found");
      case !notification.on:
        return helper.response(res, 400, "Data not found");
    }

    await FollowUpNotification.findByIdAndUpdate(
      id,
      {
        on: false,
        done_by: req.user._id,
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      notification.user,
      {
        is_contacted: true,
        last_contact: moment().toDate(),
      },
      { new: true }
    );

    data = await FollowUpNotification.findById(id, {})
      .populate("user", "name phone")
      .populate("done_by", "name phone");

    return helper.response(res, 200, "Notification has been turned off", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION selesaikan follow up
