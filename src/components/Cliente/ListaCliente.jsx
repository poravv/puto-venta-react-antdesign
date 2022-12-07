import axios from 'axios';
import { useState, useEffect, useRef } from 'react'
import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form, Image } from 'antd';
import TableModelExpand from '../TableModel/TableModelExpand';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";
import { Buffer } from 'buffer';


const URI = 'http://186.158.152.141:3001/sisweb/api/producto_final/';
const URIARTICULO = 'http://186.158.152.141:3001/sisweb/api/producto/';
let fechaActual = new Date();
const ListaClientes = ({ token }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [lstArticulos, setLstArticulos] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    //---------------------------------------------------
    //Datos de buscador
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    //---------------------------------------------------
    useEffect(() => {
        getProductoFinal();
        getArticulos();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getArticulos = async () => {
        const res = await axios.get(`${URIARTICULO}/get`, config)
        setLstArticulos(res.data.body);
    }

    const getProductoFinal = async () => {
        const res = await axios.get(`${URI}/get`, config)
        /*En caso de que de error en el server direcciona a login*/
        if (res.data.error) {
            Logout();
        }
        /*const resDataId = [
            {
                idproducto_final:1,
                estado:'AC',
                nombre:'prueba',
                descripcion:'prueba',
                children: [
                    {
                        idproducto_final:2,
                        producto:'prueba',
                        estado:'AC'
                    }
                ]
            }
        ];*/

        /*
        
         res.data.body.map((rs,index) => {
             //console.log('rs:',rs)
             //rs.razon_social= rs.proveedor.razon_social;
             //rs.ruc= rs.proveedor.ruc;
             rs.key = rs.idproducto_final;
             rs.children = [
                 {
                     key:index+1,
                     descripcion:'hola' 
                 }
                 
             ];
 
             resDataId.push(rs);
             return true;
         })
         console.log('rsData: ',resDataId);
         
         */
        setData(res.data.body);
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8, }} onKeyDown={(e) => e.stopPropagation()} >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }} />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }} >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }} >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }} >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => { close(); }} >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    const deleteProducto = async (id) => {
        await axios.put(`${URI}/inactiva/${id}`, {}, config);
        getProductoFinal();
    }

    const handleExport = () => {
        var wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Articulos');
        XLSX.writeFile(wb, 'Articulos.xlsx')
    }

    const updateProductoFinal = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        await axios.put(URI + "put/" + newData.idproducto_final, newData, config
        );
        getProductoFinal();
    }


    const columns = [
        {
            title: 'id',
            dataIndex: 'idproducto_final',
            width: '7%',
            editable: false,
            ...getColumnSearchProps('idproducto_final'),
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            width: '22%',
            editable: true,
            ...getColumnSearchProps('nombre'),
        },
        {
            title: 'Descripcion',
            dataIndex: 'descripcion',
            width: '12%',
            editable: true,
        },
        {
            title: 'Imagen',
            dataIndex: 'img',
            width: '8%',
            editable: true,
            render: (_, { img }) => {
                if (img && typeof img !== "string") {
                    //console.log(typeof img);
                    const asciiTraducido = Buffer.from(img.data).toString('ascii');
                    //console.log(asciiTraducido);
                    if (asciiTraducido) {
                        return (
                            <Image
                                style={{ border: `1px solid gray`, borderRadius: `4px` }}
                                alt="imagen"
                                //preview={false}
                                //style={{ width: '50%',margin:`0px`,textAlign:`center` }}
                                src={asciiTraducido}
                            />
                        );
                    } else {
                        return null
                    }
                } else {
                    return null
                }
            },
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            width: '10%',
            editable: true,
            render: (_, { estado, idproducto_final }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idproducto_final} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
            },
        },
        {
            title: 'Accion',
            dataIndex: 'operacion',
            render: (_, record) => {

                const editable = isEditing(record);

                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.idproducto_final, record)}
                            style={{
                                marginRight: 8,
                            }} >
                            Guardar
                        </Typography.Link>
                        <br />
                        <Popconfirm title="Desea cancelar?" onConfirm={cancel}>
                            <a href='/'>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link style={{ margin: `5px` }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Editar
                        </Typography.Link>
                        <Popconfirm
                            title="Desea eliminar este registro?"
                            onConfirm={() => confirmDel(record.idproducto_final)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No" >
                            <Typography.Link >
                                Borrar
                            </Typography.Link>
                        </Popconfirm>
                    </>
                );
            },
        }
    ];

    const columnDet = [
        {
            title: 'idproducto',
            dataIndex: 'idproducto',
            key: 'idproducto',
            width: '2%',
        },
        {
            title: 'Producto',
            dataIndex: 'idproducto',
            key: 'idproducto',
            width: '2%',
            render: (idproducto) => {
                const articulo = lstArticulos.filter((inv) => inv.idproducto === idproducto);
                //console.log(articulo[0].descripcion);
                return (
                    <Tag color={'blue'} key={idproducto} >
                        { articulo[0].descripcion}
                    </Tag>
                );
            },
        },
        {
            title: 'Estado',
            dataIndex: 'receta_estado',
            key: 'receta_estado',
            width: '2%',
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            key: 'operation',
            width: '5%',
            render: () => (
                null
            ),
        },
    ];


    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.idproducto_final);
    };


    const isEditing = (record) => record.idproducto_final === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idproducto_final) => {
        message.success('Procesando');
        //deleteProductoFinal(idproducto_final);
        deleteProducto(idproducto_final)
    };

    const save = async (idproducto_final, record) => {
        //console.log('record:  ',record.img.length);
        //console.log(idproducto_final);
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idproducto_final === item.idproducto_final);

            if (index > -1) {
                const item = newData[index];
                //console.log(newData);

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                if (record.idproducto_final === item.idproducto_final) {
                    //console.log('Entra en asignacion',record.img);
                    newData[index].img = record.img;
                }

                newData[index].fecha_upd = strFecha;

                //console.log(newData);

                updateProductoFinal(newData[index]);
                setData(newData);
                setEditingKey('');
                message.success('Registro actualizado');
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
            <h3>Articulos</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearproducto')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModelExpand columnDet={columnDet} keyDet={'idproducto'} token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idproducto_final'} />
        </>
    )
}
export default ListaClientes;