
import React, { useState } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "./../Gateway/query-recipes";
import { Button, Input } from "antd";

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

  return (
    <div className={"login-form-container"} style={{ textAlign: "center", margin: "0 5px", paddingBottom: "10px" }} >
      {errorMessage}
      <Input
        placeholder="Enter your username"
        prefix={<UserOutlined className="site-form-item-icon" />}
        onChange={value => setUsename(value.target.value)}
        className={"login-form-item"}
      />
      <Input.Password
        placeholder="Enter your password"
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
  )
}