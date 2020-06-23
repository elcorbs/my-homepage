import React, { useState } from "react";
import { Select, Modal, Form, Input, Button, Space, Divider, InputNumber } from "antd"
import { addRecipe } from "../Gateway/query-api";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "./recipeForm.scss";
const { TextArea } = Input;
const { Option } = Select;

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
        <Selector
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

function Method() {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 22 },
    },
  };
  return (
    <Form.List name="method">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <Form.Item
                {...formItemLayout}
                label={`${index + 1}`}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input an instruction or delete this step.",
                    },
                  ]}
                  noStyle
                >
                  <TextArea rows={2} placeholder="Next step here" style={{ width: '90%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    style={{ margin: '0 8px 20px 0' }}
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '100%' }}
              >
                <PlusOutlined /> Add Step
                </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  )
}
function Selector({ options, placeholder, width, formProps }) {
  const [items, setItems] = useState(options);
  const [name, setName] = useState('');

  const addItem = () => {
    setItems(opts => {
      const newOptions = opts;
      newOptions.push(name)
      return newOptions;
    });

    setName('');
  };
  const onNameChange = event => {
    setName(event.target.value);
  }

  return (
    <Form.Item {...formProps} >
      <Select
        showSearch
        style={{ width }}
        placeholder={placeholder}
        optionFilterProp="children"
        onSearch={value => setName(value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        dropdownRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '2px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'nowrap'}}>
              <Input
                style={{backgroundColor: "transparent", border: "none", color: "rgb(0,0,0.85)", flex: "auto", cursor: "default"}}
                value={name}
                onChange={onNameChange}
                disabled
              />
              <button
                className={"addSelection"}
                onClick={addItem}
              >
                <PlusOutlined />
              </button>
            </div>
          </div>
        )}
      >
        {items.map(opt => <Option key={opt} value={opt}>{opt}</Option>)}
      </Select>
    </Form.Item>
  )
}
function IngredientsList({ measures, ingredients }) {
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
                <Selector
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
                <Selector
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