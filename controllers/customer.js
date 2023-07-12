import CustomerSales from "../models/customerSales.js";
import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    let page = req.query.page;
    const usePage = req.query.usePage;

    const customer = await Role.findOne({
      name: "Customer",
    });

    let data = [];
    let sales = {};
    let salesIds = [];

    if (usePage && usePage == 1) {
      if (!page) page = 1;

      const customers = await User.find({
        role: customer._id,
        $and: [
          {
            status: true,
          },
        ],
      })
        .limit(10)
        .skip(10 * (page - 1));

      await Promise.all(
        customers.map(async (row) => {
          salesIds = [];

          const customerOfSales = await CustomerSales.find({
            customers: {
              $elemMatch: { $eq: row._id },
            },
          });

          if (customerOfSales.length > 0) {
            customerOfSales.map((cos) => {
              salesIds.push(cos.sales);
            });

            sales = await User.find({
              _id: { $in: salesIds },
            }).select("-password");
          } else {
            sales = {};
          }

          data.push({
            _id: row._id,
            name: row.name,
            sales,
          });
        })
      );

      const total = await User.countDocuments({
        role: customer._id,
        $and: [
          {
            status: true,
          },
        ],
      });

      let lastPage;

      if (total % 10 == 0) {
        lastPage = parseInt(total / 10);
      } else {
        lastPage = parseInt(total / 10) + 1;
      }

      return res.status(200).json({
        meta: {
          code: 200,
          message: "Data found",
        },
        data,
        perPage: 10,
        currentPage: page,
        pageName: "page",
        total,
        lastPage,
      });
    } else {
      const customers = await User.find({
        role: customer._id,
        $and: [
          {
            status: true,
          },
        ],
      });

      await Promise.all(
        customers.map(async (row) => {
          salesIds = [];

          const customerOfSales = await CustomerSales.find({
            customers: {
              $elemMatch: { $eq: row._id },
            },
          });

          if (customerOfSales.length > 0) {
            customerOfSales.map((cos) => {
              salesIds.push(cos.sales);
            });

            sales = await User.find({
              _id: { $in: salesIds },
            }).select("-password");
          } else {
            sales = {};
          }

          data.push({
            _id: row._id,
            name: row.name,
            sales,
          });
        })
      );

      return helper.response(res, 200, "Data found", data);
    }
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
