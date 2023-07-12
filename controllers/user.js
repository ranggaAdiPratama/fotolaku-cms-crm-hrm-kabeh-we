import Brand from "../models/brand.js";
import Role from "../models/role.js";
import User from "../models/user.js";
import UserSource from "../models/userSource.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    let page = req.query.page;
    const usePage = req.query.usePage;

    if (usePage && usePage == 1) {
      if (!page) page = 1;

      const data = await User.find({
        email: { $ne: "superAdmin@mail.com" },
        $and: [
          {
            status: true,
          },
        ],
      })
        .limit(10)
        .skip(10 * (page - 1))
        .populate("role", "name");

      const total = await User.countDocuments({
        email: { $ne: "superAdmin@mail.com" },
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
        email: { $ne: "superAdmin@mail.com" },
        $and: [
          {
            status: true,
          },
        ],
      }).populate("role", "name");

      return helper.response(res, 200, "Data found", data);
    }
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
// SECTION bulkUpdate
export const bulkUpdate = async (req, res) => {
  try {
    const ids = req.body.ids;
    const source = req.body.source;

    if (!Array.isArray(ids) || ids.length == 0) {
      return helper.response(res, 400, "ids is required");
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

    for (let i = 0; i < ids.length; i++) {
      await User.findByIdAndUpdate(ids[i], {
        source,
      });
    }

    return helper.response(res, 200, "User successfully updated");
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION bulk update
// SECTION destroy
export const destroy = async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, {
      status: false,
    });

    return helper.response(res, 200, "User succesfully deleted", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION destroy
// SECTION model
export const model = async (req, res) => {
  try {
    const model = await Role.findOne({
      name: "Model",
    });

    const data = await User.find({
      role: model._id,
      $and: [
        {
          status: true,
        },
      ],
    }).select("_id name");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION model
// SECTION  import customer
export const importData = async (req, res) => {
  try {
    let role = req.params.role;

    let data = req.body.data;

    switch (true) {
      case !data:
        return helper.response(res, 400, "data is required");
      case role != "customer":
        return helper.response(res, 400, "role unavailable");
    }

    role = await Role.findOne({
      name: "Customer",
    });

    for (let i = 0; i < data.length; i++) {
      const brandExist = await Brand.findOne({ name: data[i].brand });

      if (!brandExist) {
        await Brand.create({
          name: data[i].brand,
        });
      }

      if (data[i].source_input != "") {
        const userSourceExist = await UserSource.findOne({
          name: data[i].source_input,
        });

        if (!userSourceExist) {
          await UserSource.create({
            name: data[i].source_input,
          });
        }
      }

      await User.create({
        name: data[i].name,
        email: data[i].email,
        password: await helper.hashPassword("12345678"),
        phone: data[i].phone,
        role: role._id,
        source: data[i].source_input,
        brand: data[i].brand,
        isNewCustomer: data[i].isNewCustomer,
      });
    }

    return helper.response(res, 201, "User successfully imported");
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION import customer
// SECTION show
export const show = async (req, res) => {
  try {
    const data = await User.findOne({
      _id: req.params.id,
      $and: [
        {
          status: true,
        },
      ],
    })
      .select("-password")
      .populate("role", "name");

    if (!data) {
      return helper.response(res, 404, "Data not found", data);
    }

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION show
// SECTION store
export const store = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      brand,
      phone,
      role,
      source,
      isOutbound,
      isNewCustomer,
      survey_results,
      interest,
    } = req.body;

    let priority = null;

    switch (true) {
      case !name:
        return helper.response(res, 400, "name is required");
      case !email:
        return helper.response(res, 400, "email is required");
      case !password:
        return helper.response(res, 400, "password is required");
      case password.length < 6:
        return helper.response(
          res,
          400,
          "password must be at least 6 characters long"
        );
      case !phone:
        return helper.response(res, 400, "phone is required");
      case !role:
        return helper.response(res, 400, "role is required");
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return helper.response(res, 400, "email is already registered");
    }

    const phoneExists = await User.findOne({ phone });

    if (phoneExists) {
      return helper.response(res, 400, "phone is already registered");
    }

    const roleExist = await Role.findOne({ _id: role });

    if (!roleExist) {
      return helper.response(res, 400, "role is not registered");
    }

    if ((roleExist.name = "Customer")) {
      priority = "P1";
    }

    if (source) {
      const userSourceExist = await UserSource.findOne({
        name: source,
      });

      if (!userSourceExist) {
        await UserSource.create({
          name: source,
        });
      }
    }

    if (brand) {
      const brandExist = await Brand.findOne({ name: brand });

      if (!brandExist) {
        await Brand.create({ name: brand });
      }
    }

    let user = await User.create({
      name,
      email,
      password: await helper.hashPassword(password),
      phone,
      role,
      source,
      isOutbound,
      brand,
      isNewCustomer,
      priority,
      survey_results,
      interest,
    });

    user = await User.findById(user._id)
      .select("-password")
      .populate("role", "name");

    return helper.response(res, 201, "User successfully created", user);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION store
// SECTION update
export const update = async (req, res) => {
  try {
    const _id = req.params.id;

    let user = await User.findById(_id);

    let {
      name,
      email,
      password,
      phone,
      role,
      brand,
      source,
      isOutbound,
      isNewCustomer,
      priority,
      interest,
    } = req.body;

    if (!name) name = user.name;

    if (email) {
      const emailExists = await User.findOne({
        email,
        $and: [
          {
            email: {
              $ne: user.email,
            },
          },
        ],
      });

      if (emailExists) {
        return helper.response(res, 400, "email is already registered");
      }
    } else {
      email = user.email;
    }

    if (password) {
      if (password.length < 6) {
        return helper.response(
          res,
          400,
          "password must be at least 6 characters long"
        );
      }

      password = await helper.hashPassword(password);
    } else {
      password = user.password;
    }

    if (phone) {
      const phoneExists = await User.findOne({
        phone,
        $and: [
          {
            _id: {
              $ne: user._id,
            },
          },
        ],
      });

      if (phoneExists) {
        return helper.response(res, 400, "phone is already registered");
      }
    } else {
      phone = user.phone;
    }

    if (role) {
      const roleExist = await Role.findOne({ _id: role });

      if (!roleExist) {
        return helper.response(res, 400, "role is not registered");
      }

      if ((roleExist.name = "Customer")) {
        if (!priority) priority = user.priority;

        if (priority !== "P1" && priority !== "P2" && priority !== "P3") {
          return helper.response(res, 400, "priority not registered");
        }

        if (!isNewCustomer) isNewCustomer = user.isNewCustomer;
      } else {
        priority = null;
        isNewCustomer = null;
      }
    } else {
      role = user.role;
    }

    if (brand) {
      if (!user.brand) {
        const brandExist = await User.findOne({ brand });

        if (brandExist) {
          return helper.response(res, 400, "brand is already registered");
        }
      } else {
        const brandExist = await User.findOne({
          brand,
          $and: [
            {
              brand: {
                $ne: user.brand,
              },
            },
          ],
        });

        if (brandExist) {
          return helper.response(res, 400, "brand is already registered");
        }
      }
    } else {
      brand = user.brand;
    }

    if (!source) source = user.source;
    if (!interest) interest = user.interest;

    await User.findByIdAndUpdate(_id, {
      name,
      email,
      password,
      phone,
      role,
      brand,
      source,
      isOutbound,
      isNewCustomer,
      priority,
      interest,
    });

    user = await User.findById(user._id)
      .select("-password")
      .populate("role", "name");

    return helper.response(res, 200, "User successfully updated", user);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION update
