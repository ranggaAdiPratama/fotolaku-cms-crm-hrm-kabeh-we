import PaymentLog from "../models/paymentLog.js";

import * as helper from "../helper.js";

// SECTION update invoice
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    var paymentLog = await PaymentLog.findById(id);

    const { paid_at } = req.body;

    switch (true) {
      case !paid_at:
        return helper.response(res, 400, "paid_at is required");
    }

    if (!paymentLog) return helper.response(res, 400, "invalid bill");

    if (paymentLog.is_paid == 1) {
      return helper.response(res, 400, "bill is paid already");
    }

    let data = await PaymentLog.findByIdAndUpdate(
      id,
      {
        is_paid: 1,
        paid_at,
      },
      {
        new: true,
      }
    );

    // NOTE FINISH
    return helper.response(res, 201, "pembayaran berhasil diperbaharui", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION update invoice
