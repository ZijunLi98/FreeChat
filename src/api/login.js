import service from "../utils/request";

export const login = async (data) => {
  const result = await service.post("/user/login", data);
  return result.data;
};

export const signup = async (data) => {
  const result = await service.post("/user/signUp", data);
  return result.data;
};

export const emailverifyCheck = async (signUpToken) => {
  const result = await service.get(`/user/active/${signUpToken}`);
  return result.data;
};

export const forgetPassword = async (email) => {
  const result = await service.post("/user/forgetPwd", { email });
  return result.data;
};
export const setNewPassword = async (data, token) => {
  const result = await service.post("/user/secure/resetPwd", data);
  return result.data;
};
