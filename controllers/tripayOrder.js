import Role from "../models/role.js";
import TripayOrder from "../models/tripayOrder.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION masukan data order
export const callback = async (req, res) => {
  try {
    const paid_at = req.body.paid_at;
    const status = req.body.status;
    const reference = req.body.reference;

    let data;

    data = await TripayOrder.findOne({
      reference,
    });

    if (status == "PAID") {
      if (data) {
        await TripayOrder.findByIdAndUpdate(
          data._id,
          {
            status,
            paid_at,
          },
          {
            new: true,
          }
        );
      }

      const customer = await Role.findOne({
        name: "Customer",
      });

      await User.create({
        name: data.name,
        email: data.email,
        password: await helper.hashPassword("12345678"),
        phone: data.phone,
        role: customer,
        source: data.source,
        isNewCustomer: true,
      });
    } else if (status == "EXPIRED") {
      if (data) {
        await TripayOrder.findByIdAndRemove(data._id);
      }
    }

    return res.json({
      status: status,
      success: true,
    });
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION masukan data order

// SECTION masukan data order
export const order = async (req, res) => {
  try {
    const reference = req.body.reference;
    const method = req.body.method;
    const source = req.body.source;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const total = req.body.total;

    let data;

    switch (true) {
      case !reference:
        return helper.response(res, 400, "Data not found");
      case !method:
        return helper.response(res, 400, "Data not found");
      case !source:
        return helper.response(res, 400, "Data not found");
      case !name:
        return helper.response(res, 400, "Data not found");
      case !email:
        return helper.response(res, 400, "Data not found");
      case !phone:
        return helper.response(res, 400, "Data not found");
      case !total:
        return helper.response(res, 400, "Data not found");
    }

    data = await TripayOrder.create({
      reference,
      method,
      source,
      name,
      email,
      phone,
      total,
    });

    return helper.response(res, 200, "Tripay order has been created", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION masukan data order
