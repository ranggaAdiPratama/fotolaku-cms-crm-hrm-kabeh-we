import axios from "axios";
import crypto from "crypto";

import Brand from "../models/brand.js";
import Role from "../models/role.js";
import TripayOrder from "../models/tripayOrder.js";
import User from "../models/user.js";
import UserSource from "../models/userSource.js";

import * as helper from "../helper.js";

const env = process.env;

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
        brand: data.brand,
        email: data.email,
        password: await helper.hashPassword("12345678"),
        phone: data.phone,
        role: customer,
        source: data.source,
        isNewCustomer: true,
      });

      let payload;

      const sourceData = await UserSource.findById(data.source, {});

      if (sourceData.name.includes("bundling")) {
        payload = {
          api_key: env.WAPISENDER_API_KEY,
          device_key: env.WAPISENDER_DEVICE_KEY,
          destination: data.phone,
          message: `Halo ${data.name}!\n\nTerima kasih atas pembelian anda!\n\nSilahkan klik link berikut untuk masuk ke grup Telegram Peserta Webinar Fotolaku!\n\n https://belajarlaku.fotolaku.com/thanks \n\nUntuk Kupon Diskon 10% akan dikirimkan oleh Sales Kami!\n\nSampai jumpa di kelas nanti!\n\nTerima Kasih!`,
        };
      } else {
        payload = {
          api_key: env.WAPISENDER_API_KEY,
          device_key: env.WAPISENDER_DEVICE_KEY,
          destination: data.phone,
          message: `Halo ${data.name}!\n\nTerima kasih atas pembelian anda!\n\nSilahkan klik link berikut untuk masuk ke grup Telegram Peserta Webinar Fotolaku!\n\n https://belajarlaku.fotolaku.com/thanks \n\nSampai jumpa di kelas nanti!\n\nTerima Kasih!`,
        };
      }

      await axios.post(`https://wapisender.id/api/v1/send-message`, payload);
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
// SECTION calculator biaya
export const calculator = async (req, res) => {
  const code = req.query.code;
  const amount = req.query.amount;

  switch (true) {
    case !code:
      return helper.response(res, 400, "code is required");
    case !amount:
      return helper.response(res, 400, "amount is required");
  }

  await axios
    .get(
      `${env.TRIPAY_API_URL}merchant/fee-calculator?code=${code}&amount=${amount}`,
      {
        headers: {
          Authorization: `Bearer ${env.TRIPAY_API_KEY}`,
        },
        validateStatus: (status) => {
          return status < 999;
        },
      }
    )
    .then((result) => {
      return helper.response(res, 200, "Channel List", result["data"]);
    })
    .catch((err) => {
      console.log(err);

      return helper.response(res, 400, "Error", err);
    });
};
// !SECTION calculator biaya
// SECTION list channel
export const channel = async (req, res) => {
  await axios
    .get(`${env.TRIPAY_API_URL}merchant/payment-channel`, {
      headers: {
        Authorization: `Bearer ${env.TRIPAY_API_KEY}`,
      },
      validateStatus: (status) => {
        return status < 999;
      },
    })
    .then((result) => {
      return helper.response(res, 200, "Channel List", result["data"]);
    })
    .catch((err) => {
      console.log(err);

      return helper.response(res, 400, "Error", err);
    });
};
// !SECTION list channel
// SECTION detail order
export const detailOrder = async (req, res) => {
  const reference = req.query.reference;

  if (!reference) {
    return helper.response(res, 400, "reference is required");
  }

  await axios
    .get(`${env.TRIPAY_API_URL}transaction/detail?reference=${reference}`, {
      headers: {
        Authorization: `Bearer ${env.TRIPAY_API_KEY}`,
      },
      validateStatus: (status) => {
        return status < 999;
      },
    })
    .then((result) => {
      return helper.response(res, 200, "Channel List", result["data"]);
    })
    .catch((err) => {
      console.log(err);

      return helper.response(res, 400, "Error", err);
    });
};
// !SECTION detail order
// SECTION masukan data order
export const order = async (req, res) => {
  try {
    const method = req.body.method;
    const source = req.body.source;
    const name = req.body.name;
    let brand = req.body.brand;
    const email = req.body.email;
    const phone = req.body.phone;
    const phone_indo = req.body.phone_indo;
    const total = req.body.total;

    let data;
    let sourceData;

    switch (true) {
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

    sourceData = await UserSource.findOne({
      name: source,
    });

    if (!sourceData) {
      sourceData = await UserSource.create({
        name: source,
      });
    }

    const brandExist = await Brand.findOne({
      name: brand,
    });

    if (!brandExist) {
      await Brand.create({
        name: brand,
      });
    }

    const phoneExists = await User.findOne({
      phone,
    });

    if (phoneExists) {
      return helper.response(res, 400, "phone is already registered");
    }

    const signature = crypto
      .createHmac("sha256", env.TRIPAY_PRIVATE_KEY)
      .update(env.TRIPAY_KODE_MERCHANT + "" + total)
      .digest("hex");

    data = await TripayOrder.create({
      method,
      source: sourceData._id,
      brand,
      name,
      email,
      phone,
      total,
    });

    var expiry = parseInt(Math.floor(new Date() / 1000) + 2 * 60 * 60);

    let payload = {
      method,
      merchant_ref: "",
      amount: total,
      customer_name: name,
      customer_email: email,
      customer_phone: phone_indo,
      order_items: [
        {
          sku: "",
          name: sourceData.name,
          price: total,
          quantity: 1,
        },
      ],
      return_url: "https://belajarlaku.fotolaku.com/paid_success",
      expired_time: expiry,
      signature: signature,
    };

    let tripay = await axios.post(
      `${env.TRIPAY_API_URL}transaction/create`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${env.TRIPAY_API_KEY}`,
        },
        validateStatus: (status) => {
          return status < 999;
        },
      }
    );

    if (tripay["data"]["success"]) {
      await TripayOrder.findByIdAndUpdate(
        data._id,
        {
          reference: tripay["data"]["data"]["reference"],
        },
        {
          new: true,
        }
      );

      payload = {
        api_key: env.WAPISENDER_API_KEY,
        device_key: env.WAPISENDER_DEVICE_KEY,
        destination: phone,
        message: `Halo ${name}!\n\nTerima kasih telah melakukan pendaftaran untuk kelas Webinar Fotolaku bersama Faisal Ardans.\n\nSilahkan lakukan pembayaran dengan nominal Rp.${String(
          total
        ).replace(
          /(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g,
          "$1,"
        )} dengan cara klik link berikut\n\n${
          tripay["data"]["data"]["checkout_url"]
        }\n\natau anda juga bisa melakukan pembayaran dengan cara melalui ${
          tripay["data"]["data"]["payment_name"]
        } dengan kode ${tripay["data"]["data"]["pay_code"]}\n\nTerima Kasih!`,
      };

      await axios.post(`https://wapisender.id/api/v1/send-message`, payload);

      return helper.response(res, 200, "Order success", {
        checkout_url: tripay["data"]["data"]["checkout_url"],
        reference: tripay["data"]["data"]["reference"],
      });
    }

    return helper.response(res, 400, "Error", tripay["data"]);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION masukan data order
