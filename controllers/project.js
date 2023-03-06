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
// SECTION assign aktor project
export const assign = async (req, res) => {
  try {
    const { id } = req.params;

    let { projectLead, preparedBy, photographer, editor, revised_by } =
      req.body;

    if (projectLead) {
      const userExists = User.findById(projectLead, {});

      if (!userExists) return helper.response(res, 400, "PM doesn't exist");
    }

    if (preparedBy) {
      const userExists = await User.findById(preparedBy, {});

      if (!userExists)
        return helper.response(res, 400, "Preparator doesn't exist");
    }

    if (photographer) {
      const userExists = await User.findById(photographer, {});

      if (!userExists)
        return helper.response(res, 400, "Photographer doesn't exist");
    }

    if (editor) {
      const userExists = await User.findById(editor, {});

      if (!userExists) return helper.response(res, 400, "Editor doesn't exist");
    }

    if (revised_by) {
      const userExists = await User.findById(revised_by, {});

      if (!userExists)
        return helper.response(res, 400, "Reviser doesn't exist");
    }

    let data = await Project.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    data = await Project.findById(id).populate("lead");

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

    return helper.response(res, 200, "Staff assign completed", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION assign aktor project
