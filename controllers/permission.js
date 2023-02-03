import Permission from "../models/permission.js";
import * as helper from "../helper.js";

export const index = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    return helper.response(res, 200, "List Permissions", permissions);
  } catch (err) {
    console.log(err);
    return helper.response(res, 400, "Error ", err.message);
  }
};