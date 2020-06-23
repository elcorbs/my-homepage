import React, { useEffect, useState } from "react"
import { getRecipes, addRecipe } from "../Gateway/query-api";
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
  const ingredients = getIngredients(recipes);
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
  const submitForm = values => {
    addRecipe(values, recipeAdded)
  }
  return (
    <div>
      <BreadcrumbNavigator />
      <Button type="primary" onClick={openForm}>
        New Recipe
      </Button>
      {recipeFormVisible && (
        <RecipeFormModal
          closeModal={closeForm}
          submitForm={submitForm}
          cuisines={cuisines}
          ingredients={ingredients}
        /> 
      )}
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

function getIngredients (recipes) {
  const allIngredients = recipes.map(r => r.ingredients).flat();

  const distinctMeasurement = (value, index, self) => self.findIndex(x => x.measurement === value.measurement) === index;
  const distinctIngredient = (value, index, self) => self.findIndex(x => x.name === value.name) === index;
  const ingredients = allIngredients.filter(distinctIngredient).map(i => i.name);
  const measures = allIngredients
    .filter(distinctMeasurement).map(i => i.measurement)
    .filter(measure => measure);
  return {
    ingredients,
    measures
  }
}

function getCuisines (recipes) {
  const distinct = (value, index, self) => self.findIndex(x => x.cuisine === value.cuisine) === index;
  return recipes.filter(distinct).map(r => r.cuisine);
}
