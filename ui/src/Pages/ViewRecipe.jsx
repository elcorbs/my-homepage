import React, { useState, useEffect } from "react";
import { getRecipe, editRecipe } from "../Gateway/query-api";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";
import { EditOutlined } from "@ant-design/icons";
import RecipeFormModal from "../Components/RecipeFormModal";
import {Button} from "antd";

export default function ViewRecipe(props) {
  const [recipe, setRecipe] = useState(null);
  const [editting, setEditting] = useState(false);

  useEffect(() => {
    getRecipe(props.match.params.name, setRecipe)
  }, [props.match.params.name])
  if (!recipe) { return <div /> }

  const openEdit = () => setEditting(true);
  const submitEdit = (edittedRecipe) => {
    editRecipe(edittedRecipe, setRecipe);
    closeModal()
  }
  const closeModal = () => setEditting(false);

  return (
    <div>
      <BreadcrumbNavigator recipeName={recipe.name.toLowerCase()} />
      { editting &&
        <RecipeFormModal
          closeModal={closeModal}
          submitForm={submitEdit}
          cuisines={[recipe.cuisine]}
          recipe={recipe}
        />
      }
      <h2>
        {recipe.name} <Button style={{border: "none", backgroundColor: "transparent"}} onClick={openEdit}><EditOutlined /></Button>
      </h2>
      <p style={{ fontStyle: "italic", color: "rgb(0,0,0,0.47)" }}>
        {recipe.type} <br />
        {recipe.servings ? `serves ${recipe.servings}` : ""}
      </p>
      {recipe.recipeLink ? <a href={recipe.recipeLink} target="_blank"> Link to recipe here</a> : null}
      {recipe.ingredients ? <ul>
        {recipe.ingredients.map(i => <li key={i.name}>{i.amount} {i.measurement} {i.name} </li>)}
      </ul> : null}
      {recipe.method ? <ol>
        {recipe.method.map((m, index) => <li key={index}>{m}</li>)}
      </ol> : null}
      <p>
        {recipe.notes}
      </p>
    </div>
  )
}