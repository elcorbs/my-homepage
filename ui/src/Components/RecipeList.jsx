import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import { getCuisinesFromRecipes } from "../Utilities/helper-functions";
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
     <div className="pinIcon">
       <PushpinOutlined />
       <ul>
         {recipes.filter(r => r.pinned).map(r => <RecipeListItem recipe={r} />)}
       </ul>
     </div>
      {cuisines.map(cuisine => {
        return (
          <div key={cuisine}>
            <h2> {cuisine} </h2>
            <ul>
              {recipes.filter(r => r.cuisine === cuisine).map(recipe => <RecipeListItem recipe={recipe} />)}
            </ul>
          </div>
        )
      })}
    </Content>
  )
}

function RecipeListItem({recipe}) {
  return (
    <li key={recipe.name}>
      <Link to={`/recipes/${recipe.name}`}>{recipe.name}</Link>
      {recipe.wantToTry ? <StarFilled style={{color: "#dbbc18", marginLeft: "5px" }} /> : null}
    </li>
  )
}
