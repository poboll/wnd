import _axios from "axios";

const axios = (baseURL) => {
  const instance = _axios.create({
    baseURL: baseURL || "http://localhost:3003",
    timeout: 1000,
  });

  // 攔截並加入 jwToken
  instance.interceptors.request.use(
    (config) => {
      // 取得 Token
      const jwToken = global.auth.getToken();
      // 將 Authorization 的值設定成  'Bearer ' + jwToken
      config.headers["Authorization"] = "Bearer " + jwToken;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return instance;
};

// 傳遞參數
export { axios };

export default axios();
