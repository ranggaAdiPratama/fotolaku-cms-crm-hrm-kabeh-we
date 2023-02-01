import bcrypt from "bcrypt";

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
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

export const response = (res, code, message, data = {}) => {
  return res.status(code).json({
    meta: {
      code,
      message,
    },
    data,
  });
};
