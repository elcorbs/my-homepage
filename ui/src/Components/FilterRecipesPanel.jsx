import React from "react";
import { Select, Button } from "antd";
import { getIngredientsFromRecipes, isAdmin } from "../Utilities/helper-functions";
import "./filterPanel.scss";
import { useState } from "react";
import { MealTypeDropdown } from "../Components/FormItems/MealTypeDropdown";
const { Option } = Select;


export default function Filters({ openRecipeForm, recipes, filter }) {
  const [ingredientsFilter, setIngredientsFilter] = useState([]);
  const [mealTypeFilter, setMealTypeFilter] = useState(null);

  const filterMealType = (mealType) => {
    console.log("meal type filter", mealType)
    filter(ingredientsFilter, mealType);
    setMealTypeFilter(mealType)
  }
  const filterIngredients = (ingredients) => {
    filter(ingredients, mealTypeFilter);
    setIngredientsFilter(ingredients);
  }

  return (
    <>
      {isAdmin() && <NewRecipeButton openForm={openRecipeForm} />}
      <div className="filter-panel-container" style={{ overflow: 'scroll' }} >
        <div id='ingredient-filter'>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            onChange={filterIngredients}
            placeholder="Filter by ingredients"
            getPopupContainer={() => document.getElementById('ingredient-filter')}
          >
            {getIngredientsFromRecipes(recipes).map(ingredient => <Option key={ingredient} value={ingredient}>{ingredient}</Option>)}
          </Select>
        </div>
      </div>
      <div className="filter-panel-container">
        <MealTypeDropdown onChange={filterMealType} allowClear />
      </div>
    </>
  )
}


function NewRecipeButton({ openForm }) {
  return (
    <div style={{ textAlign: "center", borderBottom: "1px solid #e0e2e5", margin: "0 5px", paddingBottom: "10px" }}>
      <Button type="primary" onClick={openForm}>
        New Recipe
    </Button>
    </div>

  );
}
