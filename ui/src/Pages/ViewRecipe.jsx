import React, { useState, useEffect } from "react";
import { getRecipe, editRecipe, removeRecipe, toggleWantToTry, togglePinned } from "../Gateway/query-api";
import BreadcrumbNavigator from "../Components/BreadcrumbNavigator";
import { EditOutlined, DeleteOutlined, StarFilled, StarOutlined, PushpinFilled, PushpinOutlined } from "@ant-design/icons";
import RecipeFormModal from "../Components/RecipeFormModal";
import { Modal } from "antd";
import { Redirect } from "react-router-dom";
import "./viewRecipePage.scss"
import IconButton from "../Components/IconButton";
import { getUsername, isAdmin } from "../Utilities/helper-functions";

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

  const updateToggle = (value, key) => {
    setRecipe(recipe => {
      const updatedRecipe = { ...recipe };
      updatedRecipe[key] = value;
      return updatedRecipe;
    })
  }

  const toggleWantToTryFlag = () => {
    toggleWantToTry(recipe.name, !recipe.wantToTry, updateToggle);
  }

  const togglePinnedFlag = () => {
    togglePinned(recipe.name, !recipe.pinned, updateToggle);
  }

  const openDeleteModal = () => {
    Modal.confirm({
      title: `Confirm delete`,
      content: `Are you sure you want to delete the recipe for ${recipe.name}?`,
      onOk: () => removeRecipe(recipe.name, () => markAsDeleted(true)),
      okText: "Delete",
      okButtonProps: { type: "danger" },
    })
  }
  if (deleted) return <Redirect to="/recipes" />;

  return (
    <div>
      <BreadcrumbNavigator recipeName={recipe.name.toLowerCase()} />
      {editting &&
        <RecipeFormModal
          closeModal={closeModal}
          submitForm={submitEdit}
          cuisines={[recipe.cuisine]}
          recipe={recipe}
        />
      }
      <h2>
        {recipe.name}
        {getUsername() === "emma" && <IconButton color="#dbbc18" onClick={toggleWantToTryFlag} children={recipe.wantToTry ? <StarFilled /> : <StarOutlined />} />}
        {getUsername() === "emma" && <IconButton onClick={togglePinnedFlag} children={recipe.pinned ? <PushpinFilled /> : <PushpinOutlined />} />}
        {isAdmin() && <IconButton onClick={openEdit} children={<EditOutlined />} />}
        {isAdmin() && <IconButton onClick={openDeleteModal} children={<DeleteOutlined />} color="red" />}
      </h2>
      <p style={{ fontStyle: "italic", color: "rgb(0,0,0,0.47)" }}>
        {recipe.type}, {recipe.servings ? `serves ${recipe.servings}` : ""}
      </p>
      {recipe.recipeLink ? <a href={recipe.recipeLink} target="_blank" rel="noopener noreferrer"> Link to recipe here</a> : null}
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

const splitTextIntoHtmlLines = (text) => text ? text.split("\n").map(l => <>{l}<br /></>) : null;