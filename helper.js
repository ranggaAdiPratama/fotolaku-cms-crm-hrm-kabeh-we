import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import Invoice from "./models/invoice.js";
import RefreshToken from "./models/refreshToken.js";

export const addMonths = (months) => {
  var date = new Date();

  var d = date.getDate();

  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }

  return date;
};

export const checkPermission = (alias, user) => {
  let canUpdate = false;

  for (let index = 0; index < user.role.permission.length; index++) {
    if (user.role.permission[index].alias == alias) {
      canUpdate = true;

      break;
    }
  }

  return canUpdate;
};

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

export const emailConfig = () => {
  return {
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "masterrangga@gmail.com",
      pass: "crwlgkhgmnnmltkp",
    },
    secure: true,
  };
};

export const generateInvoinceNumber = async (date) => {
  // INV{tahun}{tanggal}-{antrian 3 digit}
  let inv = "INV";

  inv += new Date(date).getFullYear();

  let month = "0";

  if (new Date(date).getMonth() + 1 < 10) {
    month += new Date(date).getMonth() + 1;
  } else {
    month = new Date(date).getMonth() + 1;
  }

  inv += month;
  inv += "-";

  var start = new Date(
    new Date(date).getFullYear(),
    new Date(date).getMonth(),
    1
  );

  var end = new Date(
    new Date(date).getFullYear(),
    new Date(date).getMonth() + 1,
    0
  );

  var number = await Invoice.countDocuments({
    date: {
      $gte: start,
      $lt: end,
    },
  });

  console.log(number);

  number = number + 1;
  console.log(number);

  var series = "";

  if (number.length == 1) {
    series = "00";

    series += number.toString();
  } else if (number.length == 2) {
    series = "0";

    series += number.toString();
  } else {
    series = number.toString();
  }

  inv += series;

  return inv;
};

export const generateRefreshToken = async (id) => {
  const token = await RefreshToken.create({
    user: id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token.token;
};

export const generateToken = (id) => {
  const env = process.env;

  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 365,
  });
};

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });
  });
};

export const newCustomerMailTemplate = (user) => {
  return `<h1>Hi ${user.name}, Your order's email is: <span style="color:red;">${user.email}</span></h1><p>and your password is: </p><span style="color:red;">12345678</span>`;
};

function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

export const response = (res, code, message, data = {}) => {
  return res.status(code).json({
    meta: {
      code,
      message,
    },
    data,
  });
};
