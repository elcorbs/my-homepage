import React from "react";
import { Select, Form } from "antd";

const { Option } = Select;

export default function MealTypeDropdown() {
  return (
    <Form.Item
      label="Meal Type"
      name="type"
    >
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a type"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="Breakfast">Breakfast</Option>
        <Option value="Lunch">Lunch</Option>
        <Option value="Dinner">Dinner</Option>
        <Option value="Side">Side</Option>
        <Option value="Salad">Salad</Option>
        <Option value="SmallPlate">Small Plate</Option>
        <Option value="Dessert">Dessert</Option>
        <Option value="Bread">Bread</Option>
        <Option value="Dip">Dip</Option>
      </Select>
    </Form.Item>
  )
}