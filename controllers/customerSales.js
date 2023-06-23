import CustomerSales from "../models/customerSales.js";
import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

import moment from "moment";

// SECTION index
export const index = async (req, res) => {
  try {
    const salesRole = await Role.findOne({
      name: "Sales",
    });

    const users = await User.find({
      role: salesRole._id,
      $and: [
        {
          status: true,
        },
        {
          isOutbound: true,
        },
      ],
    });

    const ids = [];

    await Promise.all(
      users.map(async (user) => {
        const checkData = await CustomerSales.countDocuments({
          sales: user._id,
        });

        if (checkData == 0) {
          await CustomerSales.create({
            sales: user._id,
          });
        }

        ids.push(user._id);
      })
    );

    const data = await CustomerSales.find({
      sales: { $in: ids },
    })
      .populate("customers", "-password")
      .populate("sales", "-password");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION index
// SECTION add
export const add = async (req, res) => {
  try {
    const me = await User.findById(req.user._id);

    if (me.isOutbound) return helper.response(res, 400, "Forbidden");

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
        {
          isOutbound: true,
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
        .populate("customers", "-password")
        .populate("sales", "-password");
    } else {
      await CustomerSales.create({
        sales,
        customers: ids,
      });

      data = await CustomerSales.findOne({ sales })
        .populate("customers", "-password")
        .populate("sales", "-password");
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
    const me = await User.findById(req.user._id);

    if (me.isOutbound) return helper.response(res, 400, "Forbidden");

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
        {
          isOutbound: true,
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
          .populate("customers", "-password")
          .populate("sales", "-password");
      }

      data = await CustomerSales.findById(oldData._id, {})
        .populate("customers", "-password")
        .populate("sales", "-password");
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
// SECTION followUp
export const followUp = async (req, res) => {
  try {
    let data;

    const me = await User.findById(req.user._id);

    if (!me.isOutbound) return helper.response(res, 400, "Forbidden");

    const customers = req.body.customers;

    if (!Array.isArray(customers) || customers.length == 0) {
      return helper.response(res, 400, "customers is required");
    }

    for (var i = 0; i < customers.length; i++) {
      const isValidUser = await User.findOne({
        _id: customers[i],
        $and: [
          {
            status: true,
          },
        ],
      });

      if (!isValidUser) {
        return helper.response(res, 400, "user is not available");
      }

      const customerOfSales = await CustomerSales.find({
        sales: req.user._id,
        $and: [
          {
            customers: {
              $elemMatch: { $eq: customers[i] },
            },
          },
        ],
      });

      if (customerOfSales.length == 0) {
        return helper.response(res, 400, "Customer not registered");
      }
    }

    for (var i = 0; i < customers.length; i++) {
      await User.findByIdAndUpdate(customers[i], {
        follow_up_at_by_sales: moment().toDate(),
        is_contacted_by_sales: true,
        last_contact_by_sales: moment().toDate(),
      });
    }

    data = await CustomerSales.find({
      sales: req.user._id,
    })
      .populate("customers", "-password")
      .populate("sales", "-password");

    return helper.response(res, 200, "Follow Up success", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION followUp
// SECTION personalCustomer
export const personalCustomer = async (req, res) => {
  try {
    let me = await User.findById(req.user._id);

    if (!me.isOutbound) return helper.response(res, 400, "Forbidden");

    me = await CustomerSales.findOne({ sales: req.user._id });

    const data = await User.find({
      _id: { $in: me.customers },
    }).select("-password");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION personalCustomer
// SECTION setCustomer
export const setCustomer = async (req, res) => {
  try {
    let data;

    const me = await User.findById(req.user._id);

    if (me.isOutbound) return helper.response(res, 400, "Forbidden");

    const sales = req.body.sales;

    const customers = req.body.customers;

    if (!Array.isArray(customers) || customers.length == 0) {
      return helper.response(res, 400, "customers is required");
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
        {
          isOutbound: true,
        },
      ],
    });

    if (!isValidSales) {
      return helper.response(res, 400, "sales is not available");
    }

    for (var i = 0; i < customers.length; i++) {
      const isValidUser = await User.findOne({
        _id: customers[i],
        $and: [
          {
            status: true,
          },
        ],
      });

      if (!isValidUser) {
        return helper.response(res, 400, "user is not available");
      }

      const customerOfSales = await CustomerSales.find({
        sales,
        $and: [
          {
            customers: {
              $elemMatch: { $eq: customers[i] },
            },
          },
        ],
      });

      console.log(customerOfSales);

      if (customerOfSales.length == 0) {
        return helper.response(res, 400, "Customer not registered");
      }
    }

    for (var i = 0; i < customers.length; i++) {
      await User.findByIdAndUpdate(customers[i], {
        follow_up_at_by_sales: null,
        is_contacted_by_sales: false,
      });
    }

    data = await CustomerSales.find({
      sales,
    })
      .populate("customers", "-password")
      .populate("sales", "-password");

    return helper.response(res, 200, "Customer Follow up request set", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION setCustomer
// SECTION show
export const show = async (req, res) => {
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
        {
          isOutbound: true,
        },
      ],
    });

    if (!isValidSales) {
      return helper.response(res, 400, "sales is not available");
    }

    const data = await CustomerSales.find({
      sales,
    })
      .populate("customers", "-password")
      .populate("sales", "-password");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION show
