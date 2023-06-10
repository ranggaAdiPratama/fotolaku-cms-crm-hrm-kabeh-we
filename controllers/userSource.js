import UserSource from "../models/userSource.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const data = await UserSource.find({}).select("_id name");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
// SECTION destroy
export const destroy = async (req, res) => {
  try {
    const id = req.params.id;

    const existingSource = await UserSource.findById(id, {});

    if (!existingSource) return helper.response(res, 400, "Data not found");

    if (!existingSource.active) {
      return helper.response(res, 400, "Data not found");
    }

    const data = await UserSource.findByIdAndUpdate(
      id,
      {
        active: false,
      },
      {
        new: true,
      }
    );

    return helper.response(res, 200, "User source inactivated", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION destroy
// SECTION store
export const store = async (req, res) => {
  try {
    const name = req.body.name;

    if (!name) return helper.response(res, 400, "Name is required");

    const existingSource = await UserSource.findOne({
      name,
      $and: [
        {
          active: true,
        },
      ],
    });

    if (existingSource) {
      return helper.response(res, 400, "Source is registered");
    }

    const data = await UserSource.create({
      name,
    });

    return helper.response(res, 201, "User source created", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION store
// SECTION update
export const update = async (req, res) => {
  try {
    const id = req.params.id;

    const name = req.body.name;

    if (!name) return helper.response(res, 400, "Name is required");

    const existingSource = await UserSource.findById(id, {
      active: true,
    });

    if (!existingSource) return helper.response(res, 400, "Data not found");

    if (!existingSource.active) {
      return helper.response(res, 400, "Data not found");
    }

    const nameisUnique = await UserSource.countDocuments({
      name,
      $and: [
        {
          _id: {
            $ne: id,
          },
        },
      ],
    });

    if (nameisUnique > 0) {
      return helper.response(res, 400, "name is registered");
    }

    const data = await UserSource.findByIdAndUpdate(
      id,
      {
        name,
      },
      {
        new: true,
      }
    );

    return helper.response(res, 200, "User source updated", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION update
