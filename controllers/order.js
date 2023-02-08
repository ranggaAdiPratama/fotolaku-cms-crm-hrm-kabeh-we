import mongoose from "mongoose";
import nodemailer from "nodemailer";

import Order from "../models/order.js";
import OrderBrief from "../models/orderBrief.js";
import OrderItem from "../models/orderItem.js";
import OrderProduct from "../models/orderProduct.js";
import Product from "../models/product.js";
import Role from "../models/role.js";
import User from "../models/user.js";
import UserActivity from "../models/userActivity.js";

import * as helper from "../helper.js";

const ObjectId = mongoose.Types.ObjectId;

// SECTION list order
export const index = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) return helper.response(res, 400, "Please provide status");

    let all = false;

    for (let index = 0; index < req.user.role.permission.length; index++) {
      if (req.user.role.permission[index].alias == "view all crud card") {
        all = true;

        break;
      }
    }

    let data = {};

    if (all) {
      data = await Order.find({
        status,
      })
        .populate("customer", "_id name")
        .populate("product", "product qty price brief")
        .populate("sales", "_id name")
        .populate("items", "_id item status");
    } else {
      data = await Order.find({
        status,
        $and: [
          {
            customer: req.user._id,
          },
        ],
      })
        .populate("customer", "_id name")
        .populate("product", "product qty price brief")
        .populate("sales", "_id name")
        .populate("items", "_id item status");
    }

    data = await Product.populate(data, {
      path: "product.product",
      select: "_id name price",
    });

    data = await OrderBrief.populate(data, {
      path: "product.brief",
    });

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION list order
// SECTION ambil order
export const show = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await Order.findById(id, {})
      .populate("customer", "_id name")
      .populate("product", "product qty price brief")
      .populate("sales", "_id name")
      .populate("items", "_id item status");

    if (!data) return helper.response(res, 404, "Data not found");

    data = await Product.populate(data, {
      path: "product.product",
      select: "_id name price",
    });

    data = await OrderBrief.populate(data, {
      path: "product.brief",
    });

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION ambil order
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
      case newcustomer < 0:
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
        });

      let order = await Order.create({
        customer: user._id,
        brand,
        sales: karyawanSales,
      });

      await UserActivity.create({
        user: req.user._id,
        activity: `menambahkan lead atas nama ${name}`,
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

      await UserActivity.create({
        user: req.user._id,
        activity: `menambahkan lead atas nama ${isValidCustomer.name}`,
      });

      return helper.response(res, 201, "Lead berhasil ditambahkan", order);
    }
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION buat order baru
// SECTION status list
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
// !SECTION status list
// SECTION status update
export const statusUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const oldOrder = await Order.findById(id);

    if (!oldOrder) return helper.response(res, 400, "Data not found");

    if (!status) return helper.response(res, 400, "status is required");

    if (
      status !== "New Lead" &&
      status !== "Cold" &&
      status !== "Hot" &&
      status !== "Invoice State" &&
      status !== "Won" &&
      status !== "Failed"
    ) {
      return helper.response(res, 400, "status is undefined");
    }

    if (oldOrder.status === "Won" || oldOrder.status === "Failed") {
      return helper.response(res, 400, "order status can't be changed");
    }

    let order = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      }
    );

    order = await Order.findById(id)
      .populate("customer", "_id name")
      .populate("product")
      .populate("sales", "_id name");

    order = await Product.populate(order, {
      path: "product.product",
      select: "_id name price",
    });

    await UserActivity.create({
      user: req.user._id,
      activity: `mengubah status lead atas nama ${isValidCustomer.name}`,
    });

    return helper.response(res, 200, "Order status updated", order);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION status list
// SECTION update order
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    let { customer, brand, sales, product, items } = req.body;

    const oldOrder = await Order.findById(id);

    if (!oldOrder) return helper.response(res, 400, "Data not found");

    let karyawanSales = [];
    let productIds = [];
    let productItemIds = [];

    const canUpdateName = helper.checkPermission(
      "update nama customer of crud card",
      req.user
    );

    const canUpdateBrand = helper.checkPermission(
      "update brand of crud card",
      req.user
    );

    const canUpdateSales = helper.checkPermission(
      "update PIC sales of crud card",
      req.user
    );

    if (canUpdateName) {
      if (!customer) {
        return helper.response(res, 400, "customer is required");
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
    } else {
      customer = oldOrder.customer;
    }

    const isValidCustomer = await User.findOne({
      _id: customer,
      $and: [
        {
          status: true,
        },
      ],
    });

    if (canUpdateBrand) {
      if (!brand) {
        return helper.response(res, 400, "brand is required");
      }
    } else {
      brand = oldOrder.brand;
    }

    if (canUpdateSales) {
      switch (true) {
        case !sales:
          return helper.response(res, 400, "sales is required");
        case !Array.isArray(sales):
          return helper.response(res, 400, "sales should be an array");
      }

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
    } else {
      karyawanSales = oldOrder.sales;
    }

    if (product) {
      if (oldOrder.status === "Won") {
        return helper.response(res, 400, "Can't change product on won lead");
      }

      const oldOnes = oldOrder.product;

      let tobeDeleted = [];

      for (let i = 0; i < oldOrder.product.length; i++) {
        tobeDeleted.push(oldOrder.product[i]);
      }

      if (oldOnes.length > 1) {
        const deleteProduct = await OrderProduct.find({
          _id: { $in: tobeDeleted },
        });

        for (var i = 0; i < deleteProduct.length; i++) {
          if (deleteProduct[i].brief) {
            await OrderBrief.findByIdAndRemove(deleteProduct[i].brief);
          }
        }

        await OrderProduct.find({
          _id: { $in: tobeDeleted },
        }).deleteMany();
      }

      let orderProducts = [];

      for (let i = 0; i < product.length; i++) {
        const validProduct = await Product.find({
          _id: product[i].product,
        });

        if (!validProduct) {
          return helper.response(res, 400, "Product unavailable");
        }

        if (product[i].brief && typeof product[i].brief !== "object") {
          return helper.response(res, 400, "brief must be an object");
        }

        let orderProduct = await OrderProduct.create({
          product: product[i].product,
          qty: product[i].qty,
          price: product[i].price,
          total: product[i].total,
        });

        orderProducts.push(orderProduct._id);

        productIds = orderProducts.map((id) => ObjectId(id));

        if (product[i].brief) {
          const theme = product[i].brief.theme ?? null;
          const model = product[i].brief.model ?? null;
          const pose = product[i].brief.pose ?? null;
          const ratio = product[i].brief.ratio ?? null;
          const background = product[i].brief.background ?? null;
          const property = product[i].brief.property ?? null;
          const note = product[i].brief.note ?? null;

          const orderBrief = await OrderBrief.create({
            theme,
            model,
            pose,
            ratio,
            background,
            property,
            note,
          });

          await OrderProduct.findByIdAndUpdate(orderProduct._id, {
            brief: orderBrief.id,
          });
        }
      }
    } else {
      productIds = oldOrder.product;
    }

    if (items) {
      switch (true) {
        case !Array.isArray(items):
          return helper.response(res, 400, "items should be an array");
        case oldOrder.status === "Won":
          return helper.response(res, 400, "Can't change items on won lead");
      }

      const oldOnes = oldOrder.items;

      let tobeDeleted = [];

      for (let i = 0; i < oldOrder.items.length; i++) {
        tobeDeleted.push(oldOrder.items[i]);
      }

      if (oldOnes.length > 1) {
        await OrderItem.find({
          _id: { $in: tobeDeleted },
        }).deleteMany();
      }

      let orderItems = [];

      for (let i = 0; i < items.length; i++) {
        let orderItem = await OrderItem.create({
          item: items[i],
        });

        orderItems.push(orderItem._id);
      }

      productItemIds = orderItems.map((id) => ObjectId(id));
    } else {
      productItemIds = oldOrder.items;
    }

    let order = await Order.findByIdAndUpdate(
      id,
      {
        customer,
        brand,
        sales: karyawanSales,
        product: productIds,
        items: productItemIds,
      },
      {
        new: true,
      }
    );

    order = await Order.findById(order._id)
      .populate("customer", "_id name")
      .populate("product")
      .populate("sales", "_id name");

    order = await Product.populate(order, {
      path: "product.product",
      select: "_id name price",
    });

    await UserActivity.create({
      user: req.user._id,
      activity: `mengubah lead atas nama ${isValidCustomer.name}`,
    });

    return helper.response(res, 200, "Order updated", order);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION update order
