import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { useStateValue } from "./StateProvider";
import axios from "./axios";

const SidebarChat = ({ chatUser, isActive }) => {
  const [{ user, messages }, dispatch] = useStateValue();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!chatUser?._id) return;

    axios
      .get(`/message/latest/${user._id}/to/${chatUser._id}`)
      .then((response) => {
        setMessage(response.data.message);
      });
  }, [user, chatUser, messages]);

  const changeChat = (event) => {
    const sidebarChats = document.getElementsByClassName("sidebarChat");
    for (const sChat of sidebarChats) {
      sChat.className = "sidebarChat";
    }
    event.currentTarget.className += " active";

    dispatch({
      type: "SET_ACTIVE_CHAT_USER",
      payload: {
        activeChatUser: chatUser,
      },
    });
  };
  return (
    <div
      className={`sidebarChat ${isActive ? "active" : ""}`}
      onClick={changeChat}
    >
      <Avatar src={chatUser.photoURL} />
      <div className="sidebarChat__info">
        <h2>{chatUser.name}</h2>
        <p>{message ?? ""}</p>
      </div>
    </div>
  );
};

export default SidebarChat;
