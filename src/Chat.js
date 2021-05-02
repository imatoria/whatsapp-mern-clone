import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import axios from "./axios";
import { useStateValue } from "./StateProvider";

const Chat = ({ messages }) => {
  const [input, setInput] = useState("");
  const [{ user, activeChatUser }] = useStateValue();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios.get(`/message/latest/${activeChatUser._id}`).then((response) => {
      setMessage(response.data);
    });
  }, [activeChatUser]);

  const getTime = (dateTime) => {
    const utcDateTime = new Date(dateTime);
    return utcDateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post("/messages/new", {
      message: input,
      byUserId: user._id,
      toUserId: activeChatUser._id,
      timestamp: new Date().toISOString(),
    });

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={activeChatUser.photoURL} />
        <div className="chat__headerInfo">
          <h3>{activeChatUser.name}</h3>
          <p>
            Last seen at{" "}
            {message?.timestamp ? getTime(message?.timestamp) : "..."}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages &&
          messages.map((message, i) => {
            if (
              !(
                (message.byUserId === user._id &&
                  message.toUserId === activeChatUser._id) ||
                (message.toUserId === user._id &&
                  message.byUserId === activeChatUser._id)
              )
            )
              return null;
            return (
              <p
                key={i}
                className={`chat__message ${
                  message.byUserId !== activeChatUser._id && "chat__reciever"
                }`}
              >
                <span className="chat__name">{message.name}</span>
                {message.message}
                <span className="chat__timestamp">
                  {getTime(message.timestamp)}
                </span>
              </p>
            );
          })}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
