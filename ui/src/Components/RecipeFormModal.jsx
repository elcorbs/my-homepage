import React from "react";
import { Modal, Form, Input, Button } from "antd"
import SelectorWithAdd from "./FormItems/SelectorWithAdd";
import { addRecipe } from "../Gateway/query-api";
import "./recipeForm.scss";
import MealTypeDropdown from "./FormItems/MealTypeDropdown";
import IngredientsList from "./FormItems/IngredientsList";
import Method from "./FormItems/Method";
const { TextArea } = Input;

export default function RecipeFormModal({ closeModal, recipeAdded, cuisines, ingredients }) {
  const submitForm = values => {
    console.log(values)
    addRecipe(values, recipeAdded)
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <Modal
      title="New Recipe"
      visible={true}
      footer={null}
      width={700}
      onCancel={closeModal}
    >
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={submitForm}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the recipe name' }]}
        >
          <Input />
        </Form.Item>
        <MealTypeDropdown />
        <SelectorWithAdd
          options={cuisines}
          placeholder={""}
          width={400}
          formProps={{
            name: "cuisine",
            label: "Cuisine"
          }}
        />
        <IngredientsList ingredients={ingredients.ingredients} measures={ingredients.measures} />
        <Method />
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
