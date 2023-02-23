import Module from "../models/module.js";
import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const module = await Module.find({});

    return helper.response(res, 200, "List Module", module);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
