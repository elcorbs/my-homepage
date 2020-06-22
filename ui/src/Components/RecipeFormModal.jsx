import React from "react";
import { Modal, Form, Input, Button } from "antd"
import { addRecipe } from "../Gateway/query-api";

export default function RecipeFormModal({closeModal, recipeAdded}) {
const submitForm = values => {
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
        <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      </Form>
    </Modal>
  )
}