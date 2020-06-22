import React, { useEffect, useState } from "react"
import { getRecipes } from "../Gateway/query-api";
import { Link } from "react-router-dom"
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";
import RecipeFormModal from "../Components/RecipeFormModal";
import { Button } from "antd";

export default function RecipesList () {
  const [recipes, setRecipes] = useState([]);
  const [recipeFormVisible, openRecipeForm] = useState(false);
  useEffect(() => {
    getRecipes(setRecipes)
  }, [])
  if (recipes.length === 0 ) { return <div />}
  const cuisines = getCuisines(recipes);

  const openForm = () => openRecipeForm(true); 
  const closeForm = () => openRecipeForm(false); 
  const recipeAdded = (newRecipe) => {
    setRecipes(currentRecipes => {
      const newRecipes = currentRecipes;
      newRecipes.push(newRecipe);
      return newRecipes;
    })
    closeForm();
  }
  return (
    <div>
      <BreadcrumbNavigator />
      <Button type="primary" onClick={openForm}>
        New Recipe
      </Button>
      {recipeFormVisible && <RecipeFormModal closeModal={closeForm} recipeAdded={recipeAdded} />}
      {cuisines.map(cuisine => {
        return (
          <div key={cuisine}>
            <h2> { cuisine } </h2>
            <ul>
              {recipes.filter(r => r.cuisine === cuisine).map(recipe => {
                 return <li key={recipe.name}><Link to={`/recipes/${recipe.name}`}>{recipe.name}</Link></li>
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
