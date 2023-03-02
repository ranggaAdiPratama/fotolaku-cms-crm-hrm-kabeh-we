import Angle from "../models/angle.js";
import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const data = await Angle.find({}).sort("name");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
