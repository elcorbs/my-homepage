import React from "react";
import {Form, Input, Button} from "antd";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
const { TextArea } = Input;

export default function Method() {
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
                style={{flexFlow: "nowrap"}}
                {...formItemLayout}
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
                  <TextArea rows={2} placeholder={`Step ${index + 1}.`} style={{ width: '90%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                <CloseOutlined
                  style={{ color: '#e41818', margin: '0 8px 20px 0' }}
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