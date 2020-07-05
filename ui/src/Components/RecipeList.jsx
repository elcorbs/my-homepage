import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import { getCuisinesFromRecipes } from "../Utilities/helper-functions";
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
      {cuisines.map(cuisine => {
        return (
          <div key={cuisine}>
            <h2> {cuisine} </h2>
            <ul>
              {recipes.filter(r => r.cuisine === cuisine).map(recipe => {
                return <li key={recipe.name}><Link to={`/recipes/${recipe.name}`}>{recipe.name}</Link></li>
              })}
            </ul>
          </div>
        )
      })}
    </Content>
  )
}
