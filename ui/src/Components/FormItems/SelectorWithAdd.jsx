import React, {useState} from "react";
import { Form, Select, Divider, Input } from "antd";
import { PlusOutlined } from '@ant-design/icons';
const {Option} = Select;

export default function SelectorWithAdd({ options, placeholder, formProps, selectorClassName }) {
  const [items, setItems] = useState(options.filter(o => o));
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
        className={selectorClassName}
        placeholder={placeholder}
        optionFilterProp="children"
        onSearch={value => setName(value)}
        filterOption={(input, {value}) =>
          value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        dropdownRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '2px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
              <Input
                style={{ backgroundColor: "transparent", border: "none", color: "rgb(0,0,0.85)", flex: "auto", cursor: "default" }}
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