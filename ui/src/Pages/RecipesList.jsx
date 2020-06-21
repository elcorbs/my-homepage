import React, { useEffect, useState } from "react"
import { getRecipes } from "../Gateway/query-api";
import { Link } from "react-router-dom"
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";

export default function RecipesList () {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes(setRecipes)
  }, [])
  if (recipes.length === 0 ) { return <div />}
  const cuisines = getCuisines(recipes);

  return (
    <div>
      <BreadcrumbNavigator />
      {cuisines.map(cuisine => {
        return (
          <div key={cuisine}>
            <h2> { cuisine } </h2>
            <ul>
              {recipes.filter(r => r.cuisine === cuisine).map(recipe => {
                 return <li key={recipe.id}><Link to={`/recipes/${recipe.name}`}>{recipe.name}</Link></li>
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
} 

function getCuisines (recipes) {
  const distinct = (value, index, self) => self.findIndex(x => x.cuisine === value.cuisine) === index;
  return recipes.filter(distinct).map(r => r.cuisine);
}
