import React, { useState, useEffect } from "react";
import { getRecipe, editRecipe, removeRecipe } from "../Gateway/query-api";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import RecipeFormModal from "../Components/RecipeFormModal";
import {Button, Modal} from "antd";
import { Redirect } from "react-router-dom";

export default function ViewRecipe(props) {
  const [recipe, setRecipe] = useState(null);
  const [editting, setEditting] = useState(false);
  const [deleted, markAsDeleted] = useState(false);

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

  const openDeleteModal = () => {
    Modal.confirm({
     title: `Confirm delete`,
     content: `Are you sure you want to delete the recipe for ${recipe.name}?`,
     onOk: () => removeRecipe(recipe.name, () => markAsDeleted(true)),
     okText: "Delete",
     okButtonProps: {type: "danger"},
    })
  }
  if (deleted) return <Redirect to="/recipes" />;

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
        {recipe.name} 
        <Button style={{border: "none", backgroundColor: "transparent"}} onClick={openEdit}><EditOutlined /></Button> 
        <Button style={{border: "none", backgroundColor: "transparent"}} onClick={openDeleteModal}><DeleteOutlined style={{color: "red"}}/></Button> 
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
        {recipe.method.map((m, index) => <li key={index}>{splitTextIntoHtmlLines(m)}</li>)}
      </ol> : null}
      <p>
      {splitTextIntoHtmlLines(recipe.notes)}
      </p>
    </div>
  )
}

const splitTextIntoHtmlLines = (text) => text ? text.split("\n").map(l => <>{l}<br /></>): null;