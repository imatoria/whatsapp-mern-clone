import React, { useState } from "react";
import { Button } from "@material-ui/core";
import "./Login.css";
import axios from "./axios";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, dispatch] = useStateValue();

  const signIn = async (e) => {
    e.preventDefault();

    await axios
      .post("/user/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        dispatch({
          type: "LOGIN_USER",
          payload: {
            user: response.data,
          },
        });
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__containerCredentails">
          <span>1. user1@gmail.com / password1</span>
          <span>2. user2@gmail.com / password2</span>
          <span>3. user3@gmail.com / password3</span>
          <span>4. user4@gmail.com / password4</span>
          <span>5. user5@gmail.com / password5</span>
        </div>
        <img src="/images/whatsapp_logo.png" alt="" />
        <div className="login__text">
          <h1>Sign in to Whatsapp</h1>
        </div>

        <form action="#">
          <h5>Email</h5>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
          />

          <Button onClick={signIn}>Sign In</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
