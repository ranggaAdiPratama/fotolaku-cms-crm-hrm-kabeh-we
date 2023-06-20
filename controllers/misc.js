import axios from "axios";

import * as helper from "../helper.js";

const env = process.env;

// SECTION restart wapi sender
export const restartWapi = async (req, res) => {
  const payload = {
    api_key: env.WAPISENDER_API_KEY,
    device_key: env.WAPISENDER_DEVICE_KEY,
  };

  await axios
    .post(`https://wapisender.id/api/v1/restart-device`, payload)
    .then((result) => {
      return helper.response(res, 200, "Sukses :D");
    })
    .catch((err) => {
      console.log(err);

      return helper.response(res, 400, "Error", err);
    });
};
// !SECTION restart wapi sender
