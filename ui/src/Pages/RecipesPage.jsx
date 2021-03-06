import React, { useEffect, useState } from "react"
import { getRecipes, addRecipe } from "../Gateway/query-recipes";
import RecipeFormModal from "../Components/RecipeFormModal";
import RecipeList from "../Components/RecipeList";
import Filters from "../Components/FilterRecipesPanel";
import PageLayout from "./PageLayout";
import "./recipesPage.scss";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes)
  const [recipeFormVisible, openRecipeForm] = useState(false);
  useEffect(() => {
    getRecipes(r => { setRecipes(r); setFilteredRecipes(r); })
  }, [])
  if (recipes.length === 0) { return <div /> }
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

  const filter = (ingredients, mealType) => {
    const filteredRecipes = recipes.filter(recipe => {
      const matchedMealType = (!mealType || recipe.type === mealType);
      const matchedIngredients = (ingredients.length === 0 || ingredients.reduce((total, currentValue) => total && recipe.ingredients.find(i => currentValue === i.name), true));
      return matchedIngredients && matchedMealType;
    });
    setFilteredRecipes(filteredRecipes);
  }
  const FilterSideBar = (
    <Filters
      openRecipeForm={openForm}
      recipes={recipes}
      filter={filter}
    />
  )

  return (
    <div>
      {recipeFormVisible && (
        <RecipeFormModal
          closeModal={closeForm}
          submitForm={submitForm}
        />
      )}
      <PageLayout sideBarContent={FilterSideBar} path={["recipes"]}>
        <RecipeList recipes={filteredRecipes} />
      </PageLayout>
    </div>
  )
}

