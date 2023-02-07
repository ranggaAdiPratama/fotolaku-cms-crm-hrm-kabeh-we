import bcrypt from "bcrypt";

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

export const emailConfig = () => {
  return {
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: "masterrangga@gmail.com",
      pass: "rnlrulxtccutcrxn",
    },
    secure: true,
  };
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
  return `<h1>Hi ${user.name}, Your order's username is: <span style="color:red;">${user.username}</span></h1><p>and your password is: </p><span style="color:red;">12345678</span>`;
};

export const response = (res, code, message, data = {}) => {
  return res.status(code).json({
    meta: {
      code,
      message,
    },
    data,
  });
};
