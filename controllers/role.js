import Role from "../models/role.js";
import Permission from "../models/permission.js";
import * as helper from "../helper.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// SECTION index
export const index = async (req, res) => {
  try {
    const roles = await Role.find({});
    return helper.response(res, 200, "List Roles", roles);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err.message);
  }
};
// !SECTION index

// SECTION store
export const store = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      // case !permissions:
      //   return helper.response(res, 400, "permissions is required");
    }

    let permission = [];
    if (Array.isArray(permissions)) {
      permission = permissions.map(permissionId => ObjectId(permissionId));
    } else {
      permission = [];
    }

    const role = await Role.create({
      name,
      permission,
    });

    return helper.response(res, 200, "Role successfully created", role);
  } catch (err) {
    return helper.response(res, 400, "Error ", err.message);
  }
}
// !SECTION store

// SECTION update
export const update = async (req, res) => {
  try {
    const { name, alias, permissions } = req.body;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      case !alias:
        return helper.response(res, 400, "alias is required");
      case !permissions:
        return helper.response(res, 400, "permissions is required");
    }

    const role = await Role.create({
      name,
      alias,
      permissions,
    });
    return helper.response(res, 200, "Role successfully created", role);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
}
// !SECTION update

// SECTION destroy
export const destroy = async (req, res) => {
  try {
    const _id = req.params.id;
    const role = await Role.findByIdAndDelete(_id);
    return helper.response(res, 200, "Role successfully deleted");
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err);
  }
}
// !SECTION destroy