import React, { useEffect } from "react";
import "./Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "./StateProvider";
import { useHistory } from "react-router-dom";

const Sidebar = ({ users }) => {
  const [{ user }] = useStateValue();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, history]);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar_headerAvatar">
          <Avatar src={user && user.photoURL}></Avatar>
          <div className="sidebar__headerAvatarName">{user && user.name}</div>
        </div>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>

      <div className="sidebar__chats">
        {users &&
          users
            .filter((chatUser) => chatUser._id !== user._id)
            .map((chatUser, i) => {
              return (
                <SidebarChat key={i} chatUser={chatUser} isActive={i === 0} />
              );
            })}
      </div>
    </div>
  );
};

export default Sidebar;
