import mongoose from "mongoose";
import nodemailer from "nodemailer";

import Order from "../models/order.js";
import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

const ObjectId = mongoose.Types.ObjectId;

// SECTION list order
export const index = async (req, res) => {
  try {
    const { status } = req.query;

    let all = false;

    for (let index = 0; index < req.user.role.permission.length; index++) {
      if (req.user.role.permission[index].alias == "view all crud card") {
        all = true;

        break;
      }
    }

    if (all) {
    } else {
    }

    return res.send({ status, all });
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION list order
// SECTION buat order baru
export const store = async (req, res) => {
  try {
    const {
      customer,
      brand,
      sales,
      newcustomer,
      name,
      email,
      username,
      phone,
    } = req.body;

    switch (true) {
      case !brand:
        return helper.response(res, 400, "brand is required");
      case !sales:
        return helper.response(res, 400, "sales is required");
      case !Array.isArray(sales):
        return helper.response(res, 400, "sales should be an array");
      case !newcustomer:
        return helper.response(res, 400, "newcustomer is required");
    }

    let karyawanSales = [];

    if (sales.length > 0) {
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

    const customerRole = await Role.findOne({
      name: "Customer",
    });

    if (newcustomer == 1) {
      switch (true) {
        case !name:
          return helper.response(res, 400, "name is required");
        case !email:
          return helper.response(res, 400, "email is required");
        case !username:
          return helper.response(res, 400, "username is required");
        case !phone:
          return helper.response(res, 400, "phone is required");
      }

      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return helper.response(res, 400, "email is registered already");
      }

      const usernameExists = await User.findOne({ username });

      if (usernameExists) {
        return helper.response(res, 400, "username is registered already");
      }

      const phoneExists = await User.findOne({ phone });

      if (phoneExists) {
        return helper.response(res, 400, "phone is registered already");
      }

      const user = await User.create({
        name,
        username,
        email,
        password: await helper.hashPassword("12345678"),
        phone,
        role: customerRole._id,
        brand,
      });

      const mailData = {
        from: "fotolaku@test.com",
        to: email,
        subject: "Your user ",
        text: `Your new account`,
        html: helper.newCustomerMailTemplate(user),
      };

      nodemailer
        .createTransport(helper.emailConfig())
        .sendMail(mailData, (error, info) => {
          if (error) {
            console.log(error);

            return helper.response(res, 400, "Error :(", error);
          }

          console.log(info);
        });

      let order = await Order.create({
        customer: user._id,
        brand,
        sales: karyawanSales,
      });

      order = await Order.findById(order._id)
        .populate("customer", "_id name")
        .populate("sales", "_id name");

      return helper.response(res, 201, "Lead berhasil ditambahkan", order);
    } else {
      if (!customer) {
        return helper.response(res, 400, "customer is required");
      }

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

      let order = await Order.create({
        customer,
        brand,
        sales: karyawanSales,
      });

      order = await Order.findById(order._id)
        .populate("customer", "_id name")
        .populate("sales", "_id name");

      return helper.response(res, 201, "Lead berhasil ditambahkan", order);
    }
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
