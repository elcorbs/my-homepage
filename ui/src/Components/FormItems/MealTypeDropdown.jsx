import React from "react";
import { Select, Form } from "antd";

const { Option } = Select;

export default function MealTypeFormItem() {
  return (
    <Form.Item
      name="type"
    >
      <MealTypeDropdown
        showSearch
        placeholder="Select a meal type"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      />
    </Form.Item>
  )
}

export function MealTypeDropdown(props) {
  return (
    <Select
      placeholder="Filter by meal type"
      {...props}
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
  )
}