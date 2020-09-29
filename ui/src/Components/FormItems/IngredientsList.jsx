import React from "react";
import { Space, Form, Button, InputNumber } from "antd";
import SelectorWithAdd from "./SelectorWithAdd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function IngredientsList({ measures, ingredients }) {
  return (
    <Form.List name="ingredients">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map(field => (
              <Space className="list-input" key={field.key} style={{ display: 'flex', marginBottom: 3 }} align="start">
                <Form.Item
                  {...field}
                  className="small-ingredient-item"
                  name={[field.name, 'amount']}
                  fieldKey={[field.fieldKey, 'amount']}
                >
                  <InputNumber min={0} step={0.01} placeholder="#" />
                </Form.Item>
                <SelectorWithAdd
                  className="large-ingredient-item"
                  options={measures}
                  placeholder={"Measure"}
                  selectorClassName = "measure-selector"
                  formProps={{
                    ...field,
                    name: [field.name, "measurement"],
                    fieldKey: [field.fieldKey, "measurement"]
                  }}
                />
                <SelectorWithAdd
                  className="large-ingredient-item"
                  options={ingredients}
                  placeholder={"Ingredient"}
                  selectorClassName = "ingredient-selector"
                  formProps={{
                    ...field,
                    name: [field.name, "name"],
                    fieldKey: [field.fieldKey, "name"],
                    rules: [{ requied: true, message: "Please enter the ingredient" }]
                  }}
                />
                <MinusCircleOutlined
                  onClick={() => remove(field.name)} className="ingredient-remove-icon"
                />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
              >
                <PlusOutlined /> Add Ingredient
                </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  )
}