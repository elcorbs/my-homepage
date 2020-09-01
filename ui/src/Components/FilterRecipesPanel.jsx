import React from "react";
import { Layout, Select, Button, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getIngredientsFromRecipes, isAdmin } from "../Utilities/helper-functions";
import { login } from "../Gateway/query-api";
import "./filterPanel.scss";
import { useState } from "react";
const { Sider } = Layout;
const { Option } = Select;

export default function FilterPanel({ openRecipeForm, recipes, filterIngredients }) {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('emmas-recipes-token') != null);

  return (
    <>
      <Sider
        theme="light"
        className="panel"
      >
        {!loggedIn && <LoginForm setLoggedIn={setLoggedIn} />}
        {isAdmin() && <NewRecipeButton openForm={openRecipeForm} />}
        <div className="filter-panel-container">
          <p style={{ marginBottom: "0px", margin: "3px" }}>Ingredients</p>
          <Select mode="multiple" style={{ margin: "3px" }} onChange={filterIngredients}>
            {getIngredientsFromRecipes(recipes).map(ingredient => <Option key={ingredient} value={ingredient}>{ingredient}</Option>)}
          </Select>
        </div>
      </Sider>
    </>
  )
}

function LoginForm({ setLoggedIn }) {
  const [username, setUsename] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  console.log(username)
  console.log(password)
  const submitLoginForm = () => {
    setErrorMessage(null);
    login(username, password, (user) => user ? setLoggedIn(true) : userNotFound())
  }
  const userNotFound = () => {
    setErrorMessage(`Username/password combination is incorrect`)
  }

  return (
    <div className={"login-form-container"} style={{ textAlign: "center", borderBottom: "1px solid #e0e2e5", margin: "0 5px", paddingBottom: "10px" }} >
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

function NewRecipeButton({ openForm }) {
  return (
    <div style={{ textAlign: "center", borderBottom: "1px solid #e0e2e5", margin: "0 5px", paddingBottom: "10px" }}>
      <Button type="primary" onClick={openForm}>
        New Recipe
    </Button>
    </div>

  );
}
