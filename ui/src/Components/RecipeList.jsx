import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import { getCuisinesFromRecipes, getUsername } from "../Utilities/helper-functions";
import { StarFilled, PushpinOutlined } from "@ant-design/icons"
import "./styles.scss";
const { Content } = Layout;

export default function RecipeList({ recipes }) {
  const cuisines = getCuisinesFromRecipes(recipes);
  return (
    <Content className="site-layout-background"
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,

      }}>
      {getUsername() === "emma" && <PinnedRecipes recipes={recipes} />}
      {cuisines.map(cuisine => {
        return (
          <div key={cuisine}>
            <h2> {cuisine} </h2>
            <ul>
              {recipes.filter(r => r.cuisine === cuisine).map(recipe => <RecipeListItem key={recipe.name} recipe={recipe} />)}
            </ul>
          </div>
        )
      })}
    </Content>
  )
}
function PinnedRecipes({ recipes }) {
  const pinnedRecipes = recipes.filter(r => r.pinned);
  if (pinnedRecipes.length === 0) return null;
  return (
    <div className="pinnedRecipesContainer">
      <PushpinOutlined className="pinIcon" />
      <ul>
        {pinnedRecipes.map(r => <RecipeListItem key={r.name} recipe={r} />)}
      </ul>
    </div>
  )
}

function RecipeListItem({ recipe }) {
  return (
    <li key={recipe.name}>
      <Link to={`/recipes/${recipe.name}`}>{recipe.name}</Link>
      {recipe.wantToTry && getUsername() === "emma" ? <StarFilled style={{ color: "#dbbc18", marginLeft: "5px" }} /> : null}
    </li>
  )
}
