import Role from "../models/role.js";
import Permission from "../models/permission.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// SECTION index
export const index = async (req, res) => {
  try {
    const roles = await Role.find({
      status: true,
    }).populate("permission", "_id name alias");

    return helper.response(res, 200, "List Roles", roles);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err.message);
  }
};
// !SECTION index
// SECTION destroy
export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const valid = await User.findOne({
      role: id,
    });

    if (valid) {
      return helper.response(res, 400, "Role is currently used by some users");
    }

    let role = await Role.findByIdAndUpdate(id, {
      status: false,
    });

    role = await Role.findById(role._id).populate(
      "permission",
      "_id name alias"
    );

    return helper.response(res, 200, "Role successfully deleted", role);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
};
// !SECTION destroy
// SECTION show
export const show = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id, {
      status: true,
    }).populate("permission", "_id name alias");

    if (!role) return helper.response(res, 404, "Role unavailable");

    return helper.response(res, 200, "Role found", role);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err.message);
  }
};
// !SECTION show
// SECTION store
export const store = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      case !permissions:
        return helper.response(res, 400, "permissions is required");
      case !Array.isArray(permissions):
        return helper.response(
          res,
          400,
          "permissions should be an array of its id"
        );
    }

    const roleExist = await Role.findOne({ name });

    if (roleExist) {
      return helper.response(res, 400, "role is already registered");
    }

    for (let i = 0; i < permissions.length; i++) {
      const legalPermission = await Permission.findById(permissions[i]);

      if (!legalPermission) {
        return helper.response(res, 400, "permission doesn't exist");
      }
    }

    let permission = [];

    if (Array.isArray(permissions)) {
      permission = permissions.map((permissionId) => ObjectId(permissionId));
    } else {
      permission = [];
    }

    let role = await Role.create({
      name,
      permission,
    });

    role = await Role.findById(role._id).populate(
      "permission",
      "_id name alias"
    );

    return helper.response(res, 200, "Role successfully created", role);
  } catch (err) {
    return helper.response(res, 400, "Error ", err.message);
  }
};
// !SECTION store
// SECTION update
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      case !permissions:
        return helper.response(res, 400, "permissions is required");
      case !Array.isArray(permissions):
        return helper.response(
          res,
          400,
          "permissions should be an array of its id"
        );
    }

    const validRole = await Role.findById(id, {
      status: true,
    });

    if (!validRole) {
      return helper.response(res, 400, "role is unavailable");
    }

    const roleExist = await Role.findOne({
      name,
      $and: [
        {
          _id: {
            $ne: id,
          },
        },
      ],
    });

    if (roleExist) {
      return helper.response(res, 400, "role is already registered");
    }

    for (let i = 0; i < permissions.length; i++) {
      const legalPermission = await Permission.findById(permissions[i]);

      if (!legalPermission) {
        return helper.response(res, 400, "permission doesn't exist");
      }
    }

    let permission = [];

    if (Array.isArray(permissions)) {
      permission = permissions.map((permissionId) => ObjectId(permissionId));
    } else {
      permission = [];
    }

    let role = await Role.findByIdAndUpdate(
      id,
      {
        name,
        permission,
      },
      { new: true }
    );

    role = await Role.findById(role._id).populate(
      "permission",
      "_id name alias"
    );

    return helper.response(res, 200, "Role successfully updated", role);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
};
// !SECTION update
