import Role from "../models/role.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION list
export const index = async (req, res) => {
  try {
    const data = await User.find({
      username: { $ne: "supra" },
      $and: [
        {
          username: {
            $ne: req.user.username,
          },
        },
        {
          status: true,
        },
      ],
    }).populate("role", "name");

    return helper.response(res, 200, "Data found", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION list
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
    const { name, email, password, phone, role, brand } = req.body;

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

    let brandData = null;

    if (brand) {
      const brandExist = await User.findOne({ brand });

      if (brandExist) {
        return helper.response(res, 400, "brand is already registered");
      }

      brandData = brand;
    }

    let user = await User.create({
      name,
      email,
      password: await helper.hashPassword(password),
      phone,
      role,
      brand: brandData,
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

    let { name, email, password, phone, role, brand } = req.body;

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
            phone: {
              $ne: user.phone,
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

    await User.findByIdAndUpdate(_id, {
      name,
      email,
      password,
      phone,
      role,
      brand,
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
