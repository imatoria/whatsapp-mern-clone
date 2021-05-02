import React, { useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "./axios";
import Login from "./Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useStateValue } from "./StateProvider";

function App() {
  const [{ user, activeChatUser, users, messages }, dispatch] = useStateValue();

  const scrollMessage = () => {
    const chatBody = document.getElementsByClassName("chat__body")[0];
    chatBody && chatBody.scrollTo(0, 999999999999);
  };

  useEffect(() => {
    if (!user) return;

    axios.get("/users/all").then((response) => {
      dispatch({
        type: "GET_USERS",
        payload: {
          users: response.data,
        },
      });

      dispatch({
        type: "SET_ACTIVE_CHAT_USER",
        payload: {
          activeChatUser: response.data.filter((u) => u._id !== user._id)[0],
        },
      });
    });
  }, [user, dispatch]);

  useEffect(() => {
    if (!activeChatUser?._id) return;

    axios
      .get(`/messages/by/${user._id}/to/${activeChatUser._id}`)
      .then((response) => {
        dispatch({
          type: "GET_MESSAGES",
          payload: {
            messages: response.data,
          },
        });

        scrollMessage();
      });
  }, [user, activeChatUser, dispatch]);

  useEffect(() => {
    const pusher = new Pusher("d5551d6108637900eea0", {
      cluster: "mt1",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (newMessage) {
      dispatch({
        type: "SEND_MESSAGE",
        payload: {
          message: newMessage,
        },
      });

      scrollMessage();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages, dispatch]);

  return (
    <div className="app">
      <div className="app__body">
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route>
              <Sidebar users={users} />
              {activeChatUser && <Chat messages={messages} />}
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
