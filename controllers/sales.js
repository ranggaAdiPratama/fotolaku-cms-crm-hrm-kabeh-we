import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    let page = req.query.page;
    const usePage = req.query.usePage;

    const sales = await Role.findOne({
      name: "Sales",
    });

    if (usePage && usePage == 1) {
      if (!page) page = 1;

      const data = await User.find({
        role: sales._id,
        $and: [
          {
            status: true,
          },
        ],
      })
        .limit(10)
        .skip(10 * (page - 1))
        .select("_id name");

      const total = await User.countDocuments({
        role: sales._id,
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
      const data = await User.find({
        role: sales._id,
        $and: [
          {
            status: true,
          },
        ],
      }).select("_id name");

      return helper.response(res, 200, "Data found", data);
    }
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
// SECTION list inHouse sales
export const inHouse = async (req, res) => {
  try {
    let page = req.query.page;
    const usePage = req.query.usePage;

    const sales = await Role.findOne({
      name: "Sales",
    });

    if (usePage && usePage == 1) {
      if (!page) page = 1;

      const data = await User.find({
        role: sales._id,
        $and: [
          {
            status: true,
          },
          {
            isOutbound: false,
          },
        ],
      })
        .limit(10)
        .skip(10 * (page - 1))
        .select("_id name");

      const total = await User.countDocuments({
        role: sales._id,
        $and: [
          {
            status: true,
          },
          {
            isOutbound: false,
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
      const data = await User.find({
        role: sales._id,
        $and: [
          {
            status: true,
          },
          {
            isOutbound: false,
          },
        ],
      }).select("_id name");

      return helper.response(res, 200, "Data found", data);
    }
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list inHouse sales
