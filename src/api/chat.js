import service from "../utils/request";

export const createNewChat = async (title = "New Chat") => {
  const response = await service.post("/gpt/secure/chatGptInit", { title });
  return response.data;
};

export const deleteChat = async (uuid) => {
  const response = await service.post("/gpt/secure/deleteChatRoom", { uuid });
  return response.data;
};

export const getChatHistory = async (uuid) => {
  const response = await service.post("/gpt/secure/chatHistory", { uuid });
  return response.data;
};

export const sendMessage = async (data) => {
  const response = await service.post("/gpt/secure/chatMsgSend", data);
  return response.data;
};

export const stopResponse = async (uuid) => {
  const response = await service.get(`/gpt/secure/chatGptStream/stop/${uuid}`);
  return response.data;
};

export const clearMemory = async (uuid) => {
  const response = await service.post("/gpt/secure/clearMsgContext", { uuid });
  return response.data;
};

export const renameChat = async (data) => {
  const response = await service.post("/gpt/secure/renameChatRoom", data);
  return response.data;
};
