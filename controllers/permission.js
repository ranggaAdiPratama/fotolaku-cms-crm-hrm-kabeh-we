import Module from "../models/module.js";
import Permission from "../models/permission.js";
import Role from "../models/role.js";

import * as helper from "../helper.js";

export const index = async (req, res) => {
  try {
    let permissions = await Permission.find({ status: true })
      .populate("module", "_id name")
      .populate("sub_module", "_id name");

    return helper.response(res, 200, "List Permissions", permissions);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err.message);
  }
};
// SECTION destroy
export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const valid = await Role.findOne({
      permission: { $in: [id] },
    });

    if (valid) {
      return helper.response(res, 400, "Permission is currently used");
    }

    let permission = await Permission.findByIdAndUpdate(id, {
      status: false,
    });

    permission = await Permission.findById(id)
      .populate("module", "_id name")
      .populate("sub_module", "_id name");

    return helper.response(
      res,
      200,
      "Permission successfully deleted",
      permission
    );
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
};
// !SECTION destroy
export const show = async (req, res) => {
  try {
    let permission = await Permission.findById(req.params.id, {
      status: true,
    });

    if (!permission) {
      return helper.response(res, 404, "Permission not found");
    }

    permission = await Permission.findById(permission._id)
      .populate("module", "_id name")
      .populate("sub_module", "_id name");

    return helper.response(res, 200, "Permission found", permission);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err.message);
  }
};
// SECTION store
export const store = async (req, res) => {
  try {
    const { name, alias, module, sub_module } = req.body;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      case !alias:
        return helper.response(res, 400, "alias is required");
      case !module:
        return helper.response(res, 400, "module is required");
    }

    const aliasExists = await Permission.findOne({ alias });

    if (aliasExists) {
      return helper.response(res, 400, "alias is registered already");
    }

    const moduleExist = await Module.findOne({
      _id: module,
      $and: [
        {
          show: true,
        },
      ],
    });

    if (!moduleExist) {
      return helper.response(res, 400, "module is not registered");
    }

    if (sub_module) {
      const submoduleExist = await Module.findOne({
        _id: sub_module,
        $and: [
          {
            show: false,
          },
        ],
      });

      if (!submoduleExist) {
        return helper.response(res, 400, "module is not registered");
      }
    }

    let permission = await Permission.create({ ...req.body });

    permission = await Permission.findById(permission._id)
      .populate("module", "_id name")
      .populate("sub_module", "_id name");

    return helper.response(
      res,
      200,
      "Permission successfully created",
      permission
    );
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
};
// !SECTION store
// SECTION update
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    let { name, alias, module, sub_module } = req.body;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      case !alias:
        return helper.response(res, 400, "alias is required");
      case !module:
        return helper.response(res, 400, "module is required");
    }

    const aliasExists = await Permission.findOne({
      alias,
      $and: [
        {
          _id: {
            $ne: id,
          },
        },
      ],
    });

    if (aliasExists) {
      return helper.response(res, 400, "alias is registered already");
    }

    const moduleExist = await Module.findOne({
      _id: module,
      $and: [
        {
          show: true,
        },
      ],
    });

    if (!moduleExist) {
      return helper.response(res, 400, "module is not registered");
    }

    if (sub_module) {
      const submoduleExist = await Module.findOne({
        _id: sub_module,
        $and: [
          {
            show: false,
          },
        ],
      });

      if (!submoduleExist) {
        return helper.response(res, 400, "module is not registered");
      }
    }

    let permission = await Permission.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    permission = await Permission.findById(id)
      .populate("module", "_id name")
      .populate("sub_module", "_id name");

    return helper.response(
      res,
      200,
      "Permission successfully updated",
      permission
    );
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
};
// !SECTION update
