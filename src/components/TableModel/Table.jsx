
import { useState } from 'react';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from './TableModel';
import { Breadcrumb } from 'antd';
import { Tag } from 'antd';


const originData = [];

for (let i = 0; i < 100; i++) {
    originData.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
        estado: 'Ac',
    });
}

function TableFormat({ title }) {

    const columns = [
        {
            title: 'name',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'age',
            dataIndex: 'age',
            width: '15%',
            editable: true,
        },
        {
            title: 'address',
            dataIndex: 'address',
            width: '40%',
            editable: true,
        },
        {
            title: 'estado',
            dataIndex: 'estado',
            width: '20%',
            editable: true,
            render: (_, { estado }) => 
                {
                    //console.log(estado.toUpperCase())
                    let color='black';

                    if (estado.toUpperCase() === 'AC') {
                        color = 'green'
                    }
                    else {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={estado}>
                            {estado.toUpperCase() ==='AC' ? 'Activo': 'Inactivo'}
                        </Tag>
                    );
                },
        },
        {
            title: 'operacion',
            dataIndex: 'operacion',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a href='/'>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <br />
                        <Typography.Link>
                            Delete
                        </Typography.Link>

                    </>
                );
            },
        }
    ]

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };
    const isEditing = (record) => record.key === editingKey;
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');

    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };



    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    


    return (
        <>
            <Breadcrumb
                style={{
                    margin: '16px 0',
                }} >
                <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </Breadcrumb>
            <TableModel mergedColumns={mergedColumns} data={data} form={form} />
        </>
    )
}

export default TableFormat;
