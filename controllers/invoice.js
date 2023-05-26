import Invoice from "../models/invoice.js";
import Order from "../models/order.js";
import OrderBrief from "../models/orderBrief.js";
import OrderProduct from "../models/orderProduct.js";
import PaymentLog from "../models/paymentLog.js";
import Product from "../models/service.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION show invoice
export const show = async (req, res) => {
  try {
    const { number } = req.params;

    let query = await Invoice.findOne({ number }).populate(
      "order",
      "_id customer brand sales product"
    );

    if (!query) return helper.response(res, 404, "Data not found");

    query = await User.populate(query, {
      path: "order.customer",
      select: "_id name email phone",
    });

    query = await User.populate(query, {
      path: "order.sales",
      select: "_id name email phone",
    });

    query = await OrderProduct.populate(query, {
      path: "order.product",
      select: "_id product qty price brief",
    });

    query = await Product.populate(query, {
      path: "order.product.product",
      select: "_id name price",
    });

    query = await OrderBrief.populate(query, {
      path: "order.product.brief",
    });

    const logs = await PaymentLog.find({
      invoice: query._id,
    }).select("-invoice");

    let data = [];

    data.push({
      data: query,
      logs,
    });

    return helper.response(res, 200, "data found", data);
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
// !SECTION generate invoice
// SECTION update invoice
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    // SECTION deklarasi isi body
    const { payment_Progress, termin, total, paid_at, is_paid } = req.body;
    // !SECTION deklarasi isi body

    // SECTION validasi

    // SECTION validasi umum
    switch (true) {
      case !total:
        return helper.response(res, 400, "total is required");
    }
    // !SECTION validasi umum

    // SECTION validasi invoice ini ada atau tidak
    var validInvoice = await Invoice.findById(id);

    if (!validInvoice) return helper.response(res, 400, "invalid invoice");
    // !SECTION validasi validInvoice ini ada atau tidak

    // !SECTION validasi

    // SECTION update invoice
    if (payment_Progress) {
      var data = await Invoice.findByIdAndUpdate(
        id,
        {
          payment_Progress,
        },
        {
          new: true,
        }
      );
    } else {
      var data = await Invoice.findById(id, {});
    }
    // !SECTION update invoice
    // SECTION generate log
    await PaymentLog.create({
      invoice: id,
      total,
      paid_at,
      termin,
      is_paid,
    });
    // !SECTION generate log

    // NOTE FINISH
    return helper.response(res, 201, "Invoice berhasil diperbaharui", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION update invoice
