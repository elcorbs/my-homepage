import React, { useEffect, useState } from "react"
import { getRecipes, addRecipe } from "../Gateway/query-recipes";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";
import RecipeFormModal from "../Components/RecipeFormModal";
import RecipeList from "../Components/RecipeList";
import FilterPanel from "../Components/FilterRecipesPanel";
import { Layout } from "antd";
import { getCuisinesFromRecipes } from "../Utilities/helper-functions";
import "./recipesPage.scss";

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

  const filter = (ingredients, mealType) => {
    const filteredRecipes = recipes.filter(recipe => {
      const matchedMealType = (!mealType || recipe.type === mealType);
      const matchedIngredients = (ingredients.length === 0 || ingredients.reduce((total, currentValue) => total && recipe.ingredients.find(i => currentValue === i.name), true));
      return matchedIngredients && matchedMealType;
    });
    setFilteredRecipes(filteredRecipes);
  }

  return (
    <div>
      <div className="breadcrumb-container">
      <BreadcrumbNavigator path={["recipes"]} />
      </div>
      <Layout style={{flexWrap: "wrap"}}>
        <FilterPanel
          openRecipeForm={openForm}
          recipes={recipes}
          filter={filter}
        />
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
