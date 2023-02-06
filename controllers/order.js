import mongoose from "mongoose";

import Order from "../models/order.js";
import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

const ObjectId = mongoose.Types.ObjectId;

// SECTION buat order baru
export const store = async (req, res) => {
  try {
    const { customer, brand, sales } = req.body;

    switch (true) {
      case !customer:
        return helper.response(res, 400, "customer is required");
      case !brand:
        return helper.response(res, 400, "brand is required");
      case !sales:
        return helper.response(res, 400, "sales is required");
      case !Array.isArray(sales):
        return helper.response(res, 400, "sales should be an array");
    }

    const customerRole = await Role.findOne({
      name: "Customer",
    });

    const isValidCustomer = await User.findOne({
      _id: customer,
      $and: [
        {
          role: customerRole._id,
        },
        {
          status: true,
        },
      ],
    });

    if (!isValidCustomer) {
      return helper.response(res, 400, "customer is not available");
    }

    let karyawanSales = [];

    if (Array.isArray(sales)) {
      for (var i = 0; i < sales.length; i++) {
        const salesRole = await Role.findOne({
          name: "Sales",
        });

        const isValidSales = await User.findOne({
          _id: sales[i],
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
      }

      karyawanSales = sales.map((id) => ObjectId(id));
    } else {
      karyawanSales = [];
    }

    let order = await Order.create({
      customer,
      brand,
      sales: karyawanSales,
    });

    order = await Order.findById(order._id)
      .populate("customer", "_id name")
      .populate("sales", "_id name");

    return helper.response(res, 201, "Lead berhasil ditambahkan", order);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION buat order baru
// !SECTION buat order baru
export const statusList = async (req, res) => {
  try {
    return helper.response(res, 200, "Order Status", [
      "New Lead",
      "Cold",
      "Hot",
      "Invoice State",
      "Won",
      "Failed",
    ]);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
