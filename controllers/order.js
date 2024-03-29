import mongoose from "mongoose";
import moment from "moment";
// import nodemailer from "nodemailer";

import Invoice from "../models/invoice.js";
import Order from "../models/order.js";
import OrderBrief from "../models/orderBrief.js";
import OrderItem from "../models/orderItem.js";
import OrderProduct from "../models/orderProduct.js";
import Product from "../models/service.js";
import Project from "../models/project.js";
import Role from "../models/role.js";
import ServiceCategory from "../models/serviceCategory.js";
import User from "../models/user.js";
import UserActivity from "../models/userActivity.js";

import * as helper from "../helper.js";

const ObjectId = mongoose.Types.ObjectId;

// SECTION list order
export const index = async (req, res) => {
  try {
    const { status } = req.query;

    let all = true;

    // for (let index = 0; index < req.user.role.permission.length; index++) {
    //   if (req.user.role.permission[index].alias == "view all crud card") {
    //     all = true;

    //     break;
    //   }
    // }

    let data = {};

    if (all) {
      let query = {};

      if (status) {
        query.status = status;
      }

      data = await Order.find(query)
        .populate("createdBy", "_id name")
        .populate("customer", "_id name email phone")
        .populate("product", "product qty price brief")
        .populate("sales", "_id name phone")
        .populate("invoice")
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
        .populate("createdBy", "_id name")
        .populate("customer", "_id name email phone")
        .populate("product", "product qty price brief")
        .populate("sales", "_id name phone")
        .populate("invoice")
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
// SECTION customer order history
export const customerHistory = async (req, res) => {
  try {
    const id = req.params.id;

    let data = await Order.find({
      customer: id,
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "_id name")
      .populate("customer", "_id name email phone")
      .populate("product", "product qty price brief")
      .populate("sales", "_id name phone")
      .populate("invoice")
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
// !SECTION customer order history
// SECTION delete order
export const destroy = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    // Mencari order berdasarkan id
    const order = await Order.findById(orderId);

    if (!order) {
      // Jika order tidak ditemukan
      return helper.response(res, 404, "Order not found");
    }

    if (order.status === "Won (Paid)") {
      return helper.response(res, 400, "Can't delete won lead");
    }

    if (order.status === "Won (Receivable)") {
      return helper.response(res, 400, "Can't delete won lead");
    }

    // Menghapus order
    await Invoice.find({
      order: orderId,
    }).remove();

    await order.remove();

    return helper.response(res, 200, "Order deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// !SECTION delete order
// SECTION laporan
export const report = async (req, res) => {
  try {
    let range = req.query.range;
    

    let gte, lte;

    if (range == "monthly") {
      gte = moment().startOf("month").toDate();
      lte = moment().endOf("month").toDate();
    } else if(range === "weekly") {
      gte = moment().startOf("week").toDate();
      lte = moment().endOf("week").toDate();
    } else if(range === "custom"){
      let dateRange = req.query.dateRange;
      const [startDate,endDate] = dateRange.split('-')
      gte = moment(startDate).toDate();
      lte = moment(endDate).toDate();
    } else if(range === 'today'){
      const today = new Date().toISOString().slice(0,10)
      gte = moment(today).toDate();
      lte = moment(today).toDate();
    }

    let orders = await Order.find({
      createdAt: {
        $gte: gte,
        $lte: lte,
      },
    })
      .populate("createdBy")
      .populate("customer")
      .populate("product")
      .populate("sales")
      .populate("invoice")
      .populate("items")
      .lean();

    orders = await Product.populate(orders, {
      path: "product.product",
    });

    orders = await OrderBrief.populate(orders, {
      path: "product.brief",
    });

    moment.locale("id");

    let data = [];

    await Promise.all(
      orders.map(async (row, i) => {
        // if (i == 0) console.log(row.product);

        let beautyShot = 0;
        let creativeShot = 0;
        let digitalImaging = 0;
        let dll = 0;
        let dp = 0;
        let productOnWhite = 0;
        let fnbConcept = 0;
        let lookbookCatalogue = 0;
        let plainCatalogue = 0;
        let privateProject = 0;
        let video = 0;
        let videoC = 0;

        row.product.map((p) => {
          if (p.product.name == "Product On White") {
            productOnWhite = p.total;
          } else if (p.product.name == "Creative shot") {
            creativeShot = p.total;
          } else if (p.product.name == "Digital Imaging") {
            digitalImaging = p.total;
          } else if (p.product.name == "FnB Concept") {
            fnbConcept = p.total;
          } else if (p.product.name == "Plain Catalogue") {
            plainCatalogue = p.total;
          } else if (p.product.name == "Lookbook Catalogue") {
            lookbookCatalogue = p.total;
          } else if (p.product.name == "Beauty Shot") {
            beautyShot = p.total;
          } else if (p.product.name == "Video Creative") {
            videoC = p.total;
          } else if (
            p.product.name.includes("Video") &&
            p.product.name !== "Video Creative"
          ) {
            video = p.total;
          } else if (p.product.name == "Private Project") {
            privateProject = p.total;
          } else {
            dll = p.total;
          }
        });

        const orderTotal =
          productOnWhite +
          creativeShot +
          digitalImaging +
          fnbConcept +
          plainCatalogue +
          lookbookCatalogue +
          beautyShot +
          videoC +
          video +
          privateProject +
          dll;

        const invoice = await Invoice.findOne({
          order: row._id,
          $and: [
            {
              cicilan: 1,
            },
          ],
        });

        if (invoice) dp = invoice.total;

        data.push({
          date: moment(row.createdAt).format("Do MMMM YYYY"),
          brand: row.brand ?? row.customer.brand,
          status: row.status,
          salesPerson: row.sales[0].name,
          productOnWhite,
          creativeShot,
          digitalImaging,
          fnbConcept,
          plainCatalogue,
          lookbookCatalogue,
          beautyShot,
          videoC,
          video,
          privateProject,
          orderTotal,
          dp,
        });
      })
    );

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err.message);
  }
};
// !SECTION laporan
// SECTION ambil order
export const show = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await Order.findById(id, {})
      .populate("createdBy", "_id name")
      .populate("customer", "_id name email phone")
      .populate("product", "product qty price brief")
      .populate("sales", "_id name phone")
      .populate("invoice")
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
    // SECTION deklarasi isi body
    const {
      customer,
      brand,
      sales,
      newcustomer,
      name,
      email,
      phone,
      total,
      closing_deadline,
      product,
      note,
      serviceNote,
      status,
      source,
      userSource,
      isOutbound,
    } = req.body;
    // !SECTION deklarasi isi body

    // SECTION validasi
    // SECTION validasi umum
    switch (true) {
      case newcustomer < 0:
        return helper.response(res, 400, "newcustomer is required");
    }
    // !SECTION validasi umum

    // SECTION validasi brand
    var brandValue = "";

    if (brand) brandValue = brand;
    // !SECTION validasi brand

    // SECTION validasi status
    var statusValue = "New Lead";

    if (status) {
      // SECTION nilai status harus ada di dalam if
      if (
        status !== "New Lead" &&
        status !== "Opps" &&
        status !== "Hot" &&
        status !== "Invoice State" &&
        status !== "Won (Paid)" &&
        status !== "Won (Receivable)" &&
        status !== "Failed"
      ) {
        return helper.response(res, 400, "status is undefined");
      }

      statusValue = status;
      // !SECTION nilai status harus ada di dalam if
    }
    // !SECTION validasi status

    // SECTION validasi sales
    let karyawanSales = [];

    if (Array.isArray(sales) && sales.length > 0) {
      // SECTION validasi kalau ada sales
      // validasi apakah sales terdaftar atau tidak
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
      // !SECTION validasi kalau ada sales
    } else {
      // NOTE validasi kalau nggak ada sales
      karyawanSales = [];
    }
    // !SECTION validasi sales

    // SECTION variable role customer
    const customerRole = await Role.findOne({
      name: "Customer",
    });
    // !SECTION variable role customer

    // SECTION variable total lead
    let theTotal = 0;

    if (total) theTotal = total;
    // !SECTION variable total lead

    // SECTION variable kosong
    let order;
    let logTargetName = "";
    // !SECTION variable kosong

    // !SECTION validasi

    if (newcustomer == 1) {
      // SECTION new customer
      // SECTION add user
      // SECTION validasi
      // SECTION validasi umum
      switch (true) {
        case !name:
          return helper.response(res, 400, "name is required");
        case !email:
          return helper.response(res, 400, "email is required");
        case !phone:
          return helper.response(res, 400, "phone is required");
      }
      // !SECTION validasi umum

      // SECTION validasi email uniqueness
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return helper.response(res, 400, "email is registered already");
      }
      // !SECTION validasi email uniqueness

      // SECTION validasi phone uniqueness
      const phoneExists = await User.findOne({ phone });

      if (phoneExists) {
        return helper.response(res, 400, "phone is registered already");
      }
      // !SECTION validasi phone uniqueness
      // !SECTION validasi
      // SECTION add user
      const user = await User.create({
        name,
        email,
        password: await helper.hashPassword("12345678"),
        phone,
        role: customerRole._id,
        brand: brandValue,
        source: userSource,
        isOutbound,
      });
      // !SECTION add user
      // SECTION kirim email
      // const mailData = {
      //   from: "fotolaku@test.com",
      //   to: email,
      //   subject: "Your user ",
      //   text: `Your new account`,
      //   html: helper.newCustomerMailTemplate(user),
      // };

      // nodemailer
      //   .createTransport(helper.emailConfig())
      //   .sendMail(mailData, (error, info) => {
      //     if (error) {
      //       console.log(error);

      //       return helper.response(res, 400, "Error :(", error);
      //     }
      //   });
      // !SECTION kirim email
      // NOTE untuk logging
      logTargetName = name;
      // !SECTION add user

      // SECTION add order
      order = await Order.create({
        customer: user._id,
        brand: brandValue,
        sales: karyawanSales,
        total: theTotal,
        closing_deadline,
        serviceNote,
        note,
        status: statusValue,
        source,
        createdBy: req.user._id,
      });
      // !SECTION add order

      // SECTION siapin data kembalian
      order = await Order.findById(order._id)
        .populate("customer", "_id name")
        .populate("sales", "_id name");
      // !SECTION siapin data kembalian
      // !SECTION new customer
    } else {
      // SECTION existing customer
      // SECTION validasi umum
      if (!customer) {
        return helper.response(res, 400, "customer is required");
      }
      // !SECTION validasi umum
      // SECTION check apakah user terdaftar
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
        // NOTE kalau customer tidak terdaftar
        return helper.response(res, 400, "customer is not available");
      }
      // !SECTION check apakah user terdaftar

      // SECTION add order
      order = await Order.create({
        customer,
        brand: brandValue,
        sales: karyawanSales,
        total: theTotal,
        closing_deadline,
        note,
        serviceNote,
        status: statusValue,
        source,
        createdBy: req.user._id,
      });
      // !SECTION add order

      // SECTION siapkan kembalian
      order = await Order.findById(order._id)
        .populate("customer", "_id name")
        .populate("sales", "_id name");
      // SECTION siapkan kembalian
      // NOTE untuk logging
      logTargetName = isValidCustomer.name;
      // !SECTION new customer
    }
    // SECTION logging
    await UserActivity.create({
      user: req.user._id,
      activity: `menambahkan lead atas nama ${logTargetName}`,
    });
    // !SECTION logging

    if (product) {
      // SECTION kalau ada produk
      // NOTE untuk list produk di data order
      let orderProducts = [];

      for (let i = 0; i < product.length; i++) {
        // SECTION loop isi produk untuk dimasukan ke collection OrderProduct
        // SECTION validasi produk
        let validProduct = await Product.findOne({
          name: product[i].product,
        });

        if (!validProduct) {
          // SECTION kalau produk tidak terdaftar, tambahkan ke collection produk dengan kategori DLL
          const dll = await ServiceCategory.findOne({
            name: "DLL",
          });

          validProduct = await Product.create({
            name: product[i].product,
            price: product[i].price,
            category: dll._id,
          });
          // SECTION kalau produk tidak terdaftar, tambahkan ke collection produk dengan kategori DLL
        }
        // !SECTION validasi produk

        // SECTION tambahkan ke OrderProduct
        let orderProduct = await OrderProduct.create({
          product: validProduct._id,
          category: validProduct.category,
          qty: product[i].qty,
          price: product[i].price,
          total: product[i].total,
        });
        // !SECTION tambahkan ke OrderProduct

        // NOTE push ke orderProducts
        orderProducts.push(orderProduct._id);
        // !SECTION loop isi produk untuk dimasukan ke collection OrderProduct
      }

      // SECTION update order dengan list produk dari orderProducts
      let updatedOrder = await Order.findByIdAndUpdate(
        order._id,
        {
          product: orderProducts,
        },
        {
          new: true,
        }
      );
      // !SECTION update order dengan list produk dari orderProducts

      // SECTION update kembalian
      updatedOrder = await Order.findById(order._id)
        .populate("customer", "_id name")
        .populate("product")
        .populate("sales", "_id name");

      updatedOrder = await Product.populate(updatedOrder, {
        path: "product.product",
        select: "_id name price",
      });
      // !SECTION update kembalian

      // NOTE FINISH
      return helper.response(
        res,
        201,
        "Lead berhasil ditambahkan",
        updatedOrder
      );
      // !SECTION kalau ada produk
    }
    // NOTE FINISH
    return helper.response(res, 201, "Lead berhasil ditambahkan", order);
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
      "Opps",
      "Hot",
      "Invoice State",
      "Won (Paid)",
      "Won (Receivable)",
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
      status !== "Opps" &&
      status !== "Hot" &&
      status !== "Invoice State" &&
      status !== "Won (Paid)" &&
      status !== "Won (Receivable)" &&
      status !== "Failed"
    ) {
      return helper.response(res, 400, "status is undefined");
    }

    // if (oldOrder.status === "Won (Paid)" || oldOrder.status === "Won (Receivable)" || oldOrder.status === "Failed") {
    //   return helper.response(res, 400, "order status can't be changed");
    // }

    let order = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
      }
    );

    if (status == "Won (Paid)" || status == "Won (Receivable)") {
      await Project.create({
        lead: id,
      });
    }

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
      activity: `mengubah status lead atas nama ${order.customer.name}`,
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

    let {
      customer,
      brand,
      sales,
      product,
      items,
      serviceNote,
      total,
      phone,
      source,
      closing_reason,
      userSource,
      isOutbound,
    } = req.body;

    const oldOrder = await Order.findById(id);

    if (!oldOrder) return helper.response(res, 400, "Data not found");

    if (!total) {
      total = oldOrder.total;
    }

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

      if (phone) {
        const phoneExists = await User.findOne({
          phone,
          $and: [
            {
              _id: {
                $ne: customer,
              },
            },
          ],
        });

        if (phoneExists) {
          return helper.response(res, 400, "phone is already registered");
        }

        await User.findByIdAndUpdate(customer, {
          phone,
        });
      }

      if (userSource) {
        await User.findByIdAndUpdate(customer, {
          source: userSource,
        });
      }

      if (isOutbound) {
        await User.findByIdAndUpdate(customer, {
          isOutbound,
        });
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
        brand = oldOrder.brand;
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
      if (
        oldOrder.status === "Won (Paid)" ||
        oldOrder.status === "Won (Receivable)"
      ) {
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
        let validProduct = await Product.findOne({
          name: product[i].product,
        });

        if (!validProduct) {
          // SECTION kalau produk tidak terdaftar, tambahkan ke collection produk dengan kategori DLL
          const dll = await ServiceCategory.findOne({
            name: "DLL",
          });

          validProduct = await Product.create({
            name: product[i].product,
            price: product[i].price,
            category: dll._id,
          });
          // SECTION kalau produk tidak terdaftar, tambahkan ke collection produk dengan kategori DLL
        }

        if (product[i].brief && typeof product[i].brief !== "object") {
          return helper.response(res, 400, "brief must be an object");
        }

        let orderProduct = await OrderProduct.create({
          product: validProduct._id,
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
          const item = product[i].brief.item ?? null;

          const orderBrief = await OrderBrief.create({
            theme,
            model,
            pose,
            ratio,
            background,
            property,
            note,
            item,
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
        case oldOrder.status === "Won (Paid)":
          return helper.response(res, 400, "Can't change items on won lead");
        case oldOrder.status === "Won (Receivable)":
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
        serviceNote,
        total,
        source,
        closing_reason,
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

    order = await OrderBrief.populate(order, {
      path: "product.brief",
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
