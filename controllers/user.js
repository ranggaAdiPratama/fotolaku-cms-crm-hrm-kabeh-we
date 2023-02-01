import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const data = await User.find({
      username: { $ne: "supra" },
      $and: [
        {
          username: {
            $ne: req.user.username,
          },
        },
      ],
    }).populate("role", "name");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
