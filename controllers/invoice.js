import Invoice from "../models/invoice.js";
import Order from "../models/order.js";
import OrderBrief from "../models/orderBrief.js";
import OrderProduct from "../models/orderProduct.js";
import Product from "../models/service.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION show invoice
export const show = async (req, res) => {
  try {
    const { number } = req.params;

    let data = await Invoice.findOne({ number }).populate(
      "order",
      "_id customer brand sales product"
    );

    if (!data) return helper.response(res, 404, "Data not found");

    data = await User.populate(data, {
      path: "order.customer",
      select: "_id name email phone",
    });

    data = await User.populate(data, {
      path: "order.sales",
      select: "_id name email phone",
    });

    data = await OrderProduct.populate(data, {
      path: "order.product",
      select: "_id product qty price brief",
    });

    data = await Product.populate(data, {
      path: "order.product.product",
      select: "_id name price",
    });

    data = await OrderBrief.populate(data, {
      path: "order.product.brief",
    });

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION show invoice
// SECTION generate invoice
export const store = async (req, res) => {
  try {
    // SECTION deklarasi isi body
    const {
      order,
      date,
      discount,
      note,
      total,
      items,
      payment_Progress,
      cicilan,
    } = req.body;
    // !SECTION deklarasi isi body

    // SECTION validasi

    // SECTION validasi umum
    switch (true) {
      case !order:
        return helper.response(res, 400, "order is required");
      case !date:
        return helper.response(res, 400, "date is required");
      case !total:
        return helper.response(res, 400, "grand_total is required");
    }
    // !SECTION validasi umum

    // SECTION validasi order ini ada atau tidak
    var validOrder = await Order.findById(order);

    if (!validOrder) return helper.response(res, 400, "invalid order");
    // !SECTION validasi order ini ada atau tidak

    // SECTION validasi order ini punya invoice atau enggak
    const orderhasInvoice = await Invoice.findOne({
      order,
    });

    if (orderhasInvoice) {
      return helper.response(res, 400, "invoice already registered");
    }
    // !SECTION validasi order ini punya invoice atau enggak

    // SECTION cek apakah order memiliki produk
    if (validOrder.product.length == 0) {
      return helper.response(res, 400, "Order doesn't have product registered");
    }
    // !SECTION cek apakah order memiliki produk

    // !SECTION validasi

    // NOTE nomor invoice
    const number = await helper.generateInvoinceNumber(date);

    // SECTION generate invoice
    var data = await Invoice.create({
      discount,
      note,
      number,
      order,
      date,
      total,
      items,
      payment_Progress,
      cicilan,
    });
    // !SECTION generate invoice

    // SECTION update invoice pada collection order
    await Order.findByIdAndUpdate(
      order,
      {
        invoice: data._id,
      },
      {
        new: true,
      }
    );
    // !SECTION update invoice pada collection order

    // NOTE FINISH
    return helper.response(res, 201, "Invoice berhasil ditambahkan", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION create invoice
