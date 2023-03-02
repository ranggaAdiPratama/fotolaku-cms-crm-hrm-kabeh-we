import productType from "../models/productType.js";
import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const { type } = req.query;

    let data;

    data = await productType.find({}).sort("name");

    if (type) {
      data = await productType.find({ type }).sort("name");
    }

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
