import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import { Layout } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "./header.scss";

const HeaderLayout = Layout.Header;

export default function Header({ title }) {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('emmas-recipes-token') || false)
  const [loginFormVisible, toggleLoginForm] = useState(false);
  return (
    <HeaderLayout className="app-header">
      <div className="app-header-container">
        <h1 style={{ color: "#9d646e" }}>{title}</h1>
        <div className="site-navigation">
          <Link to="/profile">About Me</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/notes">Notes</Link>
          {loggedIn && <a href="/logout">Logout</a>}
          {!loggedIn && (
            <button className="faux-login-link" onClick={() => toggleLoginForm(!loginFormVisible)}>
              Login {loginFormVisible ? <UpOutlined /> : <DownOutlined />}
            </button>
          )}
        </div>
      </div>
      {loginFormVisible && <LoginForm cb={setLoggedIn} />}
    </HeaderLayout>
  )
}