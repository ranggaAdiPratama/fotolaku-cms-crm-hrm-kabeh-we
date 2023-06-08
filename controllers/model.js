import ModelDetail from "../models/modelDetail.js";
import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";
import modelDetail from "../models/modelDetail.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const model = await Role.findOne({
      name: "Model",
    });

    const models = await User.find({
      role: model._id,
      $and: [
        {
          status: true,
        },
      ],
    }).select("_id name");

    const data = [];
    let detail = [];

    await Promise.all(
      models.map(async (model) => {
        const modelHasDetail = await ModelDetail.findOne({
          model: model._id,
        });

        if (modelHasDetail) {
          detail = modelHasDetail;
        }

        data.push({
          model,
          detail,
        });
      })
    );

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
// SECTION update detail
export const updateDetail = async (req, res) => {
  try {
    let data;

    const model = req.params.id;

    const bust = req.body.bust;
    const hip = req.body.hip;
    const gender = req.body.gender;
    const height = req.body.height;
    const weight = req.body.weight;
    const age = req.body.age;
    const ethnicity = req.body.ethnicity;
    const price = req.body.price;

    const role = await Role.findOne({
      name: "Model",
    });

    const isValidModel = await User.findOne({
      _id: model,
      $and: [
        {
          role: role._id,
        },
        {
          status: true,
        },
      ],
    });

    if (!isValidModel) {
      return helper.response(res, 400, "model is not available");
    }

    switch (true) {
      case !gender:
        return helper.response(res, 400, "gender is required");
      case gender !== "L" && gender !== "P":
        return helper.response(res, 400, "gender is either 'P' or 'L'");
      case !height:
        return helper.response(res, 400, "height is required");
      case !height:
        return helper.response(res, 400, "height is required");
      case !weight:
        return helper.response(res, 400, "weight is required");
      case !age:
        return helper.response(res, 400, "age is required");
      case !ethnicity:
        return helper.response(res, 400, "ethnicity is required");
      case !price:
        return helper.response(res, 400, "price is required");
    }

    const modelHasDetail = await ModelDetail.findOne({
      model,
    });

    if (modelHasDetail) {
      data = await ModelDetail.findByIdAndUpdate(
        modelHasDetail._id,
        {
          bust,
          hip,
          gender,
          height,
          weight,
          age,
          ethnicity,
          price,
        },
        { new: true }
      ).populate("model", "_id name");
    } else {
      data = await ModelDetail.create({
        model,
        bust,
        hip,
        gender,
        height,
        weight,
        age,
        ethnicity,
        price,
      });

      data = await ModelDetail.findOne({
        _id: data._id,
      }).populate("model", "_id name");
    }

    return helper.response(res, 200, "Detail successfully updated", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION update detail
