import Project from "../models/project.js";
import Service from "../models/service.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION list project
export const index = async (req, res) => {
  try {
    const { status } = req.query;

    let data = {};

    if (status) {
      data = await Project.find({
        status,
      }).populate("lead");
    } else {
      data = await Project.find({}).populate("lead");
    }

    data = await Service.populate(data, {
      path: "lead.product",
      select: "name price",
    });

    data = await User.populate(data, {
      path: "lead.customer",
      select: "name",
    });

    data = await User.populate(data, {
      path: "lead.sales",
      select: "name",
    });

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION list project
