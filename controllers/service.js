import Service from "../models/service.js";
import CategoryService from "../models/serviceCategory.js";

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
// SECTION list categories service
export const categoriesService = async (req, res) => {
  try {
    const data = await CategoryService.find({});

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list categories services
// SECTION update service
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    // SECTION deklarasi isi body
    const { price } = req.body;
    // !SECTION deklarasi isi body

    // SECTION validasi

    // SECTION validasi umum
    switch (true) {
      case !price:
        return helper.response(res, 400, "price is required");
    }
    // !SECTION validasi umum

    // !SECTION validasi

    // SECTION update
    const data = await Service.findByIdAndUpdate(
      id,
      {
        price,
      },
      {
        new: true,
      }
    );
    // !SECTION update

    // NOTE FINISH
    return helper.response(res, 201, "Service berhasil diperbaharui", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION update service
