import React from "react";
import { Space, Form, Button, InputNumber, Checkbox } from "antd";
import SelectorWithAdd from "./SelectorWithAdd";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';

export default function IngredientsList({ measures, ingredients }) {
  return (
    <Form.List name="ingredients">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map(field => (
              <Space className="list-input" key={field.key} align="start">
                <div className="main-ingredients-line">

                <Form.Item
                  {...field}
                  className="small-ingredient-item"
                  name={[field.name, 'amount']}
                  fieldKey={[field.fieldKey, 'amount']}
                >
                  <InputNumber min={0} step={0.01} placeholder="#" />
                </Form.Item>
                <SelectorWithAdd
                  options={measures}
                  placeholder={"Measure"}
                  selectorClassName = "measure-selector"
                  formProps={{
                    ...field,
                    name: [field.name, "measurement"],
                    fieldKey: [field.fieldKey, "measurement"],
                    className: "large-ingredient-item"
                  }}
                />
                <SelectorWithAdd
                  options={ingredients}
                  placeholder={"Ingredient"}
                  selectorClassName = "ingredient-selector"
                  formProps={{
                    ...field,
                    name: [field.name, "name"],
                    fieldKey: [field.fieldKey, "name"],
                    className: "large-ingredient-item",
                    rules: [{ requied: true, message: "Please enter the ingredient" }]
                  }}
                />
                </div>
                <div className="upper-ingredients-line" >
                <Form.Item
                  {...field}
                  className="optional-ingredient-checkbox"
                  name={[field.name, 'optional']}
                  fieldKey={[field.fieldKey, 'optional']}
                  valuePropName='checked'
                  initialValue={false}
                >
                  <Checkbox>Optional </Checkbox>
                </Form.Item>
                <CloseOutlined
                  style={{color: '#e41818'}}
                  onClick={() => remove(field.name)} className="ingredient-remove-icon"
                />
                </div>
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add({})}
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