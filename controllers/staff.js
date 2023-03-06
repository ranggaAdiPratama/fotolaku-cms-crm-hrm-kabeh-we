import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    let { position } = req.query;

    if (!position) {
      return helper.response(res, 400, "Please provide a position");
    }

    position = await Role.findOne({
      name: position,
    });

    if (!position) {
      return helper.response(res, 400, "Position is invalid");
    }

    const data = await User.find({
      role: position._id,
      $and: [
        {
          status: true,
        },
      ],
    }).select("_id name");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
