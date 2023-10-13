const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const Axios = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/api`,
  headers: {
    Accept: "application/json",
  },
});

Axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response.status !== 401) {
      throw err;
    }

    if (typeof err.response.data.error.name !== "undefined") {
      if (err.response.data.error.name === "TokenExpiredError") {
        throw err;
      }
    }
  }
);

module.exports = Axios;