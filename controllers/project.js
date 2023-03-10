import Order from "../models/order.js";
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
// SECTION status list
export const statusList = async (req, res) => {
  try {
    return helper.response(res, 200, "Project Status", [
      "Pending Project",
      "New Deals",
      "Not Arrived (Product only)",
      "Not Arrived (W/model)",
      "Product only",
      "On Model",
      "digital Image",
      "video Visual",
      "Foto FNB",
      "Video FOTOLAKU",
      "3D Video",
      "Editing Video",
      "Revisi Video",
      "Editing Foto",
      "Revisi Foto & DI",
      "Retake Model",
      "Done",
      "Delivery",
      "FAIL",
    ]);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION status list
// SECTION status update
export const statusUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const oldProject = await Project.findById(id);

    if (!oldProject) return helper.response(res, 400, "Data not found");

    if (!status) return helper.response(res, 400, "status is required");

    if (
      status !== "Pending Project" &&
      status !== "New Deals" &&
      status !== "Not Arrived (Product only)" &&
      status !== "Not Arrived (W/model)" &&
      status !== "Product only" &&
      status !== "On Model" &&
      status !== "digital Image" &&
      status !== "video Visual" &&
      status !== "Foto FNB" &&
      status !== "Video FOTOLAKU" &&
      status !== "3D Video" &&
      status !== "Editing Video" &&
      status !== "Revisi Video" &&
      status !== "Editing Foto" &&
      status !== "Revisi Foto & DI" &&
      status !== "Retake Model" &&
      status !== "Done" &&
      status !== "Delivery" &&
      status !== "FAIL"
    ) {
      return helper.response(res, 400, "status is undefined");
    }

    const project = await Project.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      }
    );

    let order = await Order.findById(project.lead)
      .populate("customer", "_id name")
      .populate("product")
      .populate("sales", "_id name");

    order = await Product.populate(order, {
      path: "product.product",
      select: "_id name price",
    });

    await UserActivity.create({
      user: req.user._id,
      activity: `mengubah status project atas nama ${order.customer.name}`,
    });

    return helper.response(res, 200, "Project status updated", order);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION status list
// SECTION update
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { note } = req.body;

    const oldProject = await Project.findById(id);

    if (!oldProject) return helper.response(res, 400, "Data not found");

    if (!note) return helper.response(res, 400, "note is required");

    const project = await Project.findByIdAndUpdate(
      id,
      {
        note,
      },
      {
        new: true,
      }
    );

    let order = await Order.findById(project.lead)
      .populate("customer", "_id name")
      .populate("product")
      .populate("sales", "_id name");

    order = await Product.populate(order, {
      path: "product.product",
      select: "_id name price",
    });

    await UserActivity.create({
      user: req.user._id,
      activity: `mengubah note project atas nama ${order.customer.name}`,
    });

    return helper.response(res, 200, "Project note updated", order);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION update
