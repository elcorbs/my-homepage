import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import { Layout } from "antd";
const HeaderLayout = Layout.Header;

export default function Header({ title }) {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('emmas-recipes-token') || false)
  return (
    <HeaderLayout className="app-header">
      <h1 style={{ color: "#9d646e" }}>{title}</h1>
      <div className="header-content">
        <LoginForm cb={setLoggedIn} />
        <div className="site-navigation">
          <Link to="/profile">About Me</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/notes">Notes</Link>
          {loggedIn && <a href="/logout">Logout</a>}
        </div>
      </div>
    </HeaderLayout>
  )
}