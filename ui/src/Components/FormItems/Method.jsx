import React from "react";
import {Form, Input, Button} from "antd";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
const { TextArea } = Input;

export default function Method() {
  return (
    <Form.List name="method">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <Form.Item
                required={false}
                key={field.key}
                className="method-step-container"
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
                  <TextArea rows={2} placeholder={`Step ${index + 1}.`} />
                </Form.Item>
                {fields.length > 1 ? (
                <CloseOutlined
                  className="dynamic-delete-button"
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