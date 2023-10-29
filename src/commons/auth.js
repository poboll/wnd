import decode from "jwt-decode";
const JWT = "store_token";

// 將token儲存至 localStorage
const setToken = (token) => {
  localStorage.setItem(JWT, token);
};
// 取得 localStorage 的 token
const getToken = (token) => {
  return localStorage.getItem(JWT);
};
// 判斷是否已經登入
const isLogin = () => {
  const jwToken = getToken();
  return !!jwToken && !isTokenExpired();
};

// 解碼後取得使用者資料
const getUser = () => {
  const jwToken = getToken();
  if (isLogin()) {
    // decode解碼
    const user = decode(jwToken);
    return user;
  } else {
    return null;
  }
};
// -------------- 判斷token 是否過期
const isTokenExpired = (token) => {
  try {
    const _info = decode(token);
    if (_info.exp < Date.now() / 1000) {
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
};

const logout = () => {
  localStorage.removeItem(JWT);
};

// 全域變量
global.auth = {
  setToken,
  getUser,
  getToken,
  isLogin,
  logout,
};
