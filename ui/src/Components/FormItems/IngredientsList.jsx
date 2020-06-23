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
              <Space key={field.key} style={{ display: 'flex', marginBottom: 3 }} align="start">
                <Form.Item
                  {...field}
                  className={"listInput"}
                  name={[field.name, 'amount']}
                  fieldKey={[field.fieldKey, 'amount']}
                >
                  <InputNumber min={0} step={0.01} placeholder="Amount" />
                </Form.Item>
                <SelectorWithAdd
                  options={measures}
                  placeholder={"Measure"}
                  width={200}
                  formProps={{
                    ...field,
                    name: [field.name, "measurement"],
                    fieldKey: [field.fieldKey, "measurement"]
                  }}
                  className={"listInput"}
                />
                <SelectorWithAdd
                  options={ingredients}
                  placeholder={"Ingredient"}
                  width={200}
                  formProps={{
                    ...field,
                    name: [field.name, "name"],
                    fieldKey: [field.fieldKey, "name"],
                    rules: [{ requied: true, message: "Please enter the ingredient" }]
                  }}
                />
                <MinusCircleOutlined
                  onClick={() => remove(field.name)}
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