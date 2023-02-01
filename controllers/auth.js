import jwt from "jsonwebtoken";

import User from "../models/user.js";
import TokenBlackList from "../models/tokenBlackList.js";

import * as helper from "../helper.js";

// SECTION login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    switch (true) {
      case !username:
        return helper.response(res, 400, "username is required");
      case !password:
        return helper.response(
          res,
          400,
          "password must be at least 6 characters long"
        );
      case password.length < 6:
        return helper.response(
          res,
          400,
          "password must be at least 6 characters long"
        );
    }

    const user = await User.findOne({ username }).populate("role");

    if (!user) {
      return helper.response(res, 400, "User not found");
    }

    const match = await helper.comparePassword(password, user.password);

    if (!match) {
      return helper.response(res, 400, "Incorrect password");
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const data = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
      token,
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
