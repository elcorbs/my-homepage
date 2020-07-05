import React from "react";
import { Layout, Select, Button } from "antd";
import { getIngredientsFromRecipes } from "../Utilities/helper-functions";
const { Sider } = Layout;
const { Option } = Select;

export default function FilterPanel({ openRecipeForm, recipes, filterIngredients }) {
  return (
    <>
      <Sider
        theme="light"
        style={{
          backgroundColor: "#f0f2f5",
          overflow: 'auto',
          height: '100vh',
          left: 0,
          position: "sticky",
          top: 0,
          paddingTop: "20px",
          borderRight: "1px solid #e0e2e5"
        }}
      >
        <div style={{ textAlign: "center", borderBottom: "1px solid #e0e2e5", margin: "0 5px", paddingBottom: "10px" }}>
          <NewRecipeButton openForm={openRecipeForm} />
        </div>
        Ingredients
        <Select mode="multiple" style={{ width: '95%' }} onChange={filterIngredients}>
          {getIngredientsFromRecipes(recipes).map(ingredient => <Option key={ingredient} value={ingredient}>{ingredient}</Option>)}
        </Select>
      </Sider>
    </>
  )
}

function NewRecipeButton({ openForm }) {
  return (
    <Button type="primary" onClick={openForm}>
      New Recipe
    </Button>
  );
}
