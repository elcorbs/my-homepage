import React, { useEffect, useState } from "react"
import { getRecipes, addRecipe } from "../Gateway/query-api";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";
import RecipeFormModal from "../Components/RecipeFormModal";
import RecipeList from "../Components/RecipeList";
import FilterPanel from "../Components/FilterRecipesPanel";
import { Layout } from "antd";
import { getCuisinesFromRecipes } from "../Utilities/helper-functions";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes)
  const [recipeFormVisible, openRecipeForm] = useState(false);
  useEffect(() => {
    getRecipes(r => { setRecipes(r); setFilteredRecipes(r); })
  }, [])
  if (recipes.length === 0) { return <div /> }
  const cuisines = getCuisinesFromRecipes(recipes);
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

  const filterIngredients = (ingredients) => {
    const filteredRecipes = recipes.filter(recipe =>
      ingredients.reduce((total, currentValue) => total && recipe.ingredients.find(i => currentValue == i.name), true)
    );
    setFilteredRecipes(filteredRecipes);
  }

  return (
    <div>
      <BreadcrumbNavigator />
      <Layout>
        <FilterPanel openRecipeForm={openForm} recipes={recipes} filterIngredients={filterIngredients} />
        {recipeFormVisible && (
          <RecipeFormModal
            closeModal={closeForm}
            submitForm={submitForm}
            cuisines={cuisines}
          />
        )}
        <RecipeList recipes={filteredRecipes} />
      </Layout>
    </div>
  )
}
