
import React, { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "./../Gateway/query-recipes";
import { Button, Input } from "antd";
import "./loginForm.scss";

export default function LoginForm({ cb }) {
  const [username, setUsename] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('emmas-recipes-token') || false);
  const postLogin = () => {
    setLoggedIn(true);
    cb(true);
  }
  const submitLoginForm = () => {
    setErrorMessage(null);
    login(username, password, (user) => user ? postLogin() : userNotFound())
  }
  const userNotFound = () => {
    setErrorMessage(`Username/password combination is incorrect`)
  }

  if (loggedIn) return null;

  return (<>
  {errorMessage && <div className="error-message">{errorMessage}</div>}
    <div className={"login-form-container"} >
      <Input
        placeholder="Username"
        prefix={<UserOutlined className="site-form-item-icon" />}
        onChange={value => setUsename(value.target.value)}
        className={"login-form-item"}
      />
      <Input.Password
        placeholder="Password"
        prefix={<LockOutlined />}
        onChange={value => setPassword(value.target.value)}
        className={"login-form-item"}
      />
      <Button
        type="primary"
        onClick={submitLoginForm}
        className={"login-form-item"}
      >
        Login
      </Button>
    </div>
  </>)
}