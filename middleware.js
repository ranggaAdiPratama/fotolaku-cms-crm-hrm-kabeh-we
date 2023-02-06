import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import Permission from "./models/permission.js";
import User from "./models/user.js";
import tokenBlackList from "./models/tokenBlackList.js";

import * as helper from "./helper.js";

export const auth = expressAsyncHandler(async (req, res, next) => {
  const env = process.env;

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const tokenisInvalid = await tokenBlackList.findOne({
        token: token,
      });

      if (tokenisInvalid) {
        return helper.response(res, 401, "Invalid token");
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);

      let user = await User.findById(decoded.id)
        .select("-password")
        .populate("role");

      user = await Permission.populate(user, {
        path: "role.permission",
        select: "_id name alias",
      });

      req.user = user;

      next();
    } catch (err) {
      return helper.response(res, 401, "Unauthenticated");
    }
  } else {
    return helper.response(res, 401, "Unauthenticated");
  }
});

export const checkPermission = (alias) => {
  return async (req, res, next) => {
    let go = 0;

    for (let index = 0; index < req.user.role.permission.length; index++) {
      if (req.user.role.permission[index].alias == alias) go++;
    }

    if (go === 0) {
      return helper.response(res, 403, "Forbidden");
    }

    next();
  };
};

export const checkMultiplePermission = (alias1, alias2) => {
  return async (req, res, next) => {
    let go = 0;

    for (let index = 0; index < req.user.role.permission.length; index++) {
      if (req.user.role.permission[index].alias == alias1) go++;
      if (req.user.role.permission[index].alias == alias2) go++;
    }

    if (go === 0) {
      return helper.response(res, 403, "Forbidden");
    }

    next();
  };
};
