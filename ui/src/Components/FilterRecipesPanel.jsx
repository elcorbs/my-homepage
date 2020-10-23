import React from "react";
import { Select, Button, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getIngredientsFromRecipes, isAdmin } from "../Utilities/helper-functions";
import { login } from "../Gateway/query-recipes";
import "./filterPanel.scss";
import { useState } from "react";
import { MealTypeDropdown } from "../Components/FormItems/MealTypeDropdown";
const { Option } = Select;


export default function Filters({ openRecipeForm, recipes, filter }) {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('emmas-recipes-token') != null);
  const [ingredientsFilter, setIngredientsFilter] = useState([]);
  const [mealTypeFilter, setMealTypeFilter] = useState(null);

  const filterMealType = (mealType) => {
    console.log("meal type filter", mealType)
    filter(ingredientsFilter, mealType);
    setMealTypeFilter(mealType)
  }
  const filterIngredients = (ingredients) => {
    filter(ingredients, mealTypeFilter);
    setIngredientsFilter(ingredients);
  }

  return (
    <>
      {!loggedIn && <LoginForm setLoggedIn={setLoggedIn} />}
      {isAdmin() && <NewRecipeButton openForm={openRecipeForm} />}
      <div className="filter-panel-container" style={{overflow: 'scroll'}} >
        <div id='ingredient-filter'>
          <Select
            mode="multiple"
            style={{width: "100%"}}
            onChange={filterIngredients}
            placeholder="Filter by ingredients"
            getPopupContainer={() => document.getElementById('ingredient-filter')}
          >
            {getIngredientsFromRecipes(recipes).map(ingredient => <Option key={ingredient} value={ingredient}>{ingredient}</Option>)}
          </Select>
        </div>
      </div>        
      <div className="filter-panel-container">
        <MealTypeDropdown onChange={filterMealType} allowClear />
      </div>
    </>
  )
}

function LoginForm({ setLoggedIn }) {
  const [username, setUsename] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
