import React from "react";
import { Modal, Form, Input, Button, InputNumber, Switch } from "antd"
import SelectorWithAdd from "./FormItems/SelectorWithAdd";
import "./recipeForm.scss";
import MealTypeFormItem from "./FormItems/MealTypeDropdown";
import IngredientsList from "./FormItems/IngredientsList";
import Method from "./FormItems/Method";
import { useState, useEffect } from "react";
import { getStoredIngredients } from "../Gateway/query-api";
const { TextArea } = Input;

export default function RecipeFormModal({ closeModal, submitForm, cuisines, recipe }) {
  const [storedIngredients, setStoredIngredients] = useState({ ingredients: [], measures: [] })
  const [usingLink, useLink] = useState(recipe && recipe.recipeLink != null)
  useEffect(() => {
    getStoredIngredients(setStoredIngredients)
  }, [])

  const removeHiddenValues = (recipe) => {
    if (usingLink) {
      recipe.ingredients = undefined
      recipe.servings = undefined
      recipe.method = undefined
    } else {
      recipe.recipeLink = undefined
    }
    return recipe;
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      style={{
        overflowY: "scroll",
        overflowX: "hidden"
      }}
      title={`${recipe ? "Edit" : "New"} Recipe`}
      visible={true}
      footer={null}
      width={700}
      onCancel={closeModal}
    >
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true, ...recipe }}
        onFinish={recipe => submitForm(removeHiddenValues(recipe))}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the recipe name' }]}
        >
          <Input disabled={recipe ? true : false} />
        </Form.Item>
        <MealTypeFormItem />
        <SelectorWithAdd
          options={cuisines}
          placeholder={""}
          formProps={{
            name: "cuisine",
            label: "Cuisine"
          }}
        />
        <SwitchWithLabel initialValue={usingLink} onChange={useLink} />
        {
          usingLink
            ? <LinkRecipe />
            : <ManualRecipeEntry storedIngredients={storedIngredients} />
        }
        <Form.Item name="notes" label="Notes" >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
function SwitchWithLabel({ initialValue, onChange }) {
  return (
    <div className={"fauxFormItem"}>
      <span className={"fauxLabel"}>Link a Recipe: </span><Switch className={"switch"} defaultChecked={initialValue} onChange={onChange} />
    </div>
  )
}

function ManualRecipeEntry({ storedIngredients }) {
  return (
    <>
      <Form.Item
        label="Number of Servings"
        name="servings"
      >
        <InputNumber min={0} step={1} placeholder={"Number of servings"} />
      </Form.Item>
      <IngredientsList ingredients={storedIngredients.ingredients} measures={storedIngredients.measures} />
      <Method />
    </>
  )
}

function LinkRecipe() {
  return (
    <Form.Item
      name="recipeLink"
      label="Link to Recipe"
    >
      <Input />
    </Form.Item>
  )
}
