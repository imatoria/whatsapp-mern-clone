export const initialState = {
  user: null,
  activeChatUser: null,
  users: [],
  messages: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        user: action.payload.user,
      };
    case "SET_ACTIVE_CHAT_USER":
      return {
        ...state,
        activeChatUser: action.payload.activeChatUser,
      };
    case "GET_USERS":
      return {
        ...state,
        users: action.payload.users,
      };
    case "GET_MESSAGES":
      return {
        ...state,
        messages: action.payload.messages,
      };
    case "SEND_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload.message],
      };
    default:
      break;
  }
};

export default reducer;
