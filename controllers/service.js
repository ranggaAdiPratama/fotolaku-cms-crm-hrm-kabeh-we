import Service from "../models/service.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const data = await Service.find({})
      .populate("category", "_id name")
      .populate("backgroundList", "_id name")
      .populate("modelList", "_id name")
      .populate("ratioList", "_id name")
      .populate("poseList", "_id name")
      .populate("propertyList", "_id name")
      .populate("productTypeList", "_id name type")
      .populate("angleList", "_id name")
      .populate("themeList", "_id name")
      .sort("name");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
// SECTION showbyCategory
export const showbyCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const data = await Service.find({ category })
      .populate("category", "_id name")
      .populate("backgroundList", "_id name")
      .populate("modelList", "_id name")
      .populate("ratioList", "_id name")
      .populate("poseList", "_id name")
      .populate("propertyList", "_id name")
      .populate("productTypeList", "_id name type")
      .populate("angleList", "_id name")
      .populate("themeList", "_id name")
      .sort("name");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION showbyCategory
