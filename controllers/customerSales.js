import Brand from "../models/brand.js";
import CustomerSales from "../models/customerSales.js";
import Role from "../models/role.js";
import User from "../models/user.js";
import UserSource from "../models/userSource.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const sales = req.params.id;

    const salesRole = await Role.findOne({
      name: "Sales",
    });

    const isValidSales = await User.findOne({
      _id: sales,
      $and: [
        {
          role: salesRole._id,
        },
        {
          status: true,
        },
      ],
    });

    if (!isValidSales) {
      return helper.response(res, 400, "sales is not available");
    }

    const data = await CustomerSales.find({
      sales,
    })
      .populate("customers")
      .populate("sales");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
// SECTION add
export const add = async (req, res) => {
  try {
    let data;

    const sales = req.params.id;

    const ids = req.body.customers;

    if (!Array.isArray(ids) || ids.length == 0) {
      return helper.response(res, 400, "ids is required");
    }

    const salesRole = await Role.findOne({
      name: "Sales",
    });

    const isValidSales = await User.findOne({
      _id: sales,
      $and: [
        {
          role: salesRole._id,
        },
        {
          status: true,
        },
      ],
    });

    if (!isValidSales) {
      return helper.response(res, 400, "sales is not available");
    }

    for (var i = 0; i < ids.length; i++) {
      const isValidUser = await User.findOne({
        _id: ids[i],
        $and: [
          {
            status: true,
          },
        ],
      });

      if (!isValidUser) {
        return helper.response(res, 400, "user is not available");
      }
    }

    const checkData = await CustomerSales.countDocuments({
      sales,
    });

    if (checkData == 1) {
      const oldData = await CustomerSales.countDocuments({
        sales,
      });

      for (var i = 0; i < ids.length; i++) {
        await CustomerSales.findByIdAndUpdate(
          oldData._id,
          {
            $push: { customers: ids[i] },
          },
          { new: true }
        );
      }

      data = await CustomerSales.findById(oldData._id, {})
        .populate("customers")
        .populate("sales");
    } else {
      await CustomerSales.create({
        sales,
        customers: ids,
      });

      data = await CustomerSales.findOne({ sales })
        .populate("customers")
        .populate("sales");
    }

    return helper.response(res, 200, "Customer successfully added", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION add
// SECTION delete
export const deleteCustomer = async (req, res) => {
  try {
    let data;

    const sales = req.params.id;

    const ids = req.body.customers;

    if (!Array.isArray(ids) || ids.length == 0) {
      return helper.response(res, 400, "ids is required");
    }

    const salesRole = await Role.findOne({
      name: "Sales",
    });

    const isValidSales = await User.findOne({
      _id: sales,
      $and: [
        {
          role: salesRole._id,
        },
        {
          status: true,
        },
      ],
    });

    if (!isValidSales) {
      return helper.response(res, 400, "sales is not available");
    }

    for (var i = 0; i < ids.length; i++) {
      const isValidUser = await User.findOne({
        _id: ids[i],
        $and: [
          {
            status: true,
          },
        ],
      });

      if (!isValidUser) {
        return helper.response(res, 400, "user is not available");
      }
    }

    const checkData = await CustomerSales.countDocuments({
      sales,
    });

    if (checkData == 1) {
      const oldData = await CustomerSales.countDocuments({
        sales,
      });

      for (let i = 0; i < ids.length; i++) {
        await CustomerSales.findByIdAndUpdate(
          oldData._id,
          {
            $pull: { customers: ids[i] },
          },
          { new: true }
        )
          .populate("customers")
          .populate("sales");
      }

      data = await CustomerSales.findById(oldData._id, {})
        .populate("customers")
        .populate("sales");
    } else {
      return helper.response(res, 400, "Data not found");
    }

    return helper.response(res, 200, "Customer successfully added", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION delete
