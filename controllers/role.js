import Role from "../models/role.js";
import * as helper from "../helper.js";

export const index = async (req, res) => {
  try {
    const roles = await Role.find({});
    return helper.response(res, 200, "List Roles", roles);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err.message);
  }
};