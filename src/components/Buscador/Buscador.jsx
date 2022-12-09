
import { Form, Select } from 'antd';

function Buscador({ data, label, value,dataIndex,title, onChange, onSearch }) {

    return (
        <Form.Item name={dataIndex}
            style={{ margin: 0, }}
            rules={[{ required: true, message: `Por favor seleccione ${title}!`, },]} >
            <Select
                showSearch
                allowClear
                placeholder={`Select ${title}`}
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                    (option?.razon_social ??
                        option?.descripcion??
                        option?.nombre ?? '').toLowerCase().includes(input.toLowerCase())
                }
                fieldNames={{
                    label: label,
                    value: value,
                    options: data
                }}
                options={data}
                
            />
        </Form.Item>
    );
}

export default Buscador;