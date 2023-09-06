import service from "../utils/request";

export const topup = async (cipherKey) => {
  const data = {
    cipherKey,
  };
  const result = await service.post("/user/secure/desposit", data);
  return result.data;
};

export const getCurrentBalance = async () => {
  const result = await service.post("/user/secure/queryBalance", {});
  return result.data;
};
