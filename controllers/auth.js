import Permission from "../models/permission.js";
import RefreshToken from "../models/refreshToken.js";
import TokenBlackList from "../models/tokenBlackList.js";
import User from "../models/user.js";

import * as helper from "../helper.js";

// SECTION login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    switch (true) {
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
    }

    let user = await User.findOne({ email }).populate("role");

    if (!user) {
      return helper.response(res, 400, "User not found");
    }

    const match = await helper.comparePassword(password, user.password);

    if (!match) {
      return helper.response(res, 400, "Incorrect password");
    }

    const token = helper.generateToken(user._id);

    const refreshToken = await helper.generateRefreshToken(user._id);

    user = await Permission.populate(user, {
      path: "role.permission",
      select: "alias",
    });

    const data = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role.name,
        permission: user.role.permission,
      },
      token,
      refreshToken,
    };

    helper.response(res, 200, "logged in successfully", data);
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION login
// SECTION logout
export const logout = async (req, res) => {
  try {
    const authorization = req.headers.authorization.split(" ")[1];

    await RefreshToken.updateMany(
      {
        user: req.user._id,
        $and: [{ revoked: "" }],
      },
      {
        $set: {
          revoked: new Date(Date.now()),
        },
      }
    );

    await new TokenBlackList({
      token: authorization,
    }).save();

    helper.response(res, 200, "logged out successfully");
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION logout
// SECTION refresh
export const refresh = async (req, res) => {
  try {
    let { token } = req.body;

    let refreshToken = await RefreshToken.findOne({
      token,
      $and: [
        {
          revoked: "",
        },
      ],
    });

    if (!refreshToken) {
      return helper.response(res, 400, "Token tidak terdaftar", req.user._id);
    }

    await RefreshToken.updateMany(
      {
        user: refreshToken.user._id,
        $and: [{ revoked: "" }],
      },
      {
        $set: {
          revoked: new Date(Date.now()),
        },
      }
    );

    token = helper.generateToken(refreshToken.user);
    refreshToken = await helper.generateRefreshToken(refreshToken.user);

    const data = {
      token,
      refreshToken,
    };

    helper.response(res, 200, "Token berhasil direfresh", data);
  } catch (err) {
    return helper.response(res, 400, "Error : " + err.message, err);
  }
};
// !SECTION refresh
// SECTION test
export const test = async (req, res) => {
  try {
    helper.response(res, 200, "success");
  } catch (err) {
    console.log(err);

    return helper.response(res, 400, "Error", err);
  }
};
// !SECTION test
