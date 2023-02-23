import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const model = await Role.findOne({
      name: "Sales",
    });

    const data = await User.find({
      role: model._id,
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
