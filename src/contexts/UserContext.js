import React, { useReducer } from "react";
export const UserContext = React.createContext({
  balance: "",
  chatList: [],
  userDispatch: () => {},
});
const initialState = {
  balance: "",
  chatList: [],
  inviteCode: "",
};

const userReducer = (state, action) => {
  let newChatList;
  switch (action.type) {
    case "init":
      return { ...state, ...action.init };
    case "renameChat":
      newChatList = state.chatList.forEach((item) => {
        if (item.uuid === action.chatId) {
          item.title = action.newTitle;
        }
      });
      return { ...state, balance: action.balance };
    case "addNewChat":
      return { ...state, chatList: [...state.chatList, action.chat] };
    case "deleteChat":
      newChatList = state.chatList.filter(
        (item) => item.uuid !== action.chatId
      );
      return { ...state, chatList: newChatList };
    default:
      return state;
  }
};

const UserProvider = (props) => {
  const [userState, userDispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider
      value={{
        balance: userState.balance,
        chatList: userState.chatList,
        inviteCode: userState.inviteCode,
        userDispatch,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
