import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModelExpand from '../TableModel/TableModelExpand';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const URI = 'http://186.158.152.141:3001/sisweb/api/inventario';
let fechaActual = new Date();
const ListaInventario = ({ token,idsucursal }) => {

    //console.log('idsuc: ',idsucursal)

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    //const [lstProducto, setLstProducto] = useState([]);
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
        getInventario();
        //getDetInventario();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

   /*
    const getDetInventario = async () => {
        const res = await axios.get(`${URIDETINV}/get`, config)
        console.log('detalle: ',res.data.body);;
        setLstProducto(res.data.body);
    }
   */

    const getInventario = async () => {
        const res = await axios.get(URI + `/getinvsuc/${idsucursal}`, config)
        setData(res.data.body);
        /*En caso de que de error en el server direcciona a login*/
        if(res.data.error){
            Logout();
        }
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


    const deleteDetInventario = async (iddet_inventario,cantidad,idinventario) => {
        try {
            await axios.put(`${URI}/inactiva/${iddet_inventario}`,{estado:'IN',cantidad:cantidad,idinventario:idinventario}, config);
        } catch (error) {
            console.log(error)
        }
        //getDetInventario();
    }

    const handleExport = () => {
        var wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Producto');
        XLSX.writeFile(wb, 'Producto.xlsx')
    }

    const updateInventario = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        await axios.put(URI + "put/" + newData.idinventario, newData, config
        );
        getInventario();
    }


    const columns = [
        {
            title: 'id',
            dataIndex: 'idinventario',
            width: '7%',
            editable: false,
            ...getColumnSearchProps('idinventario'),
        },
        {
            title: 'Producto',
            dataIndex: 'producto',
            width: '22%',
            editable: true,
            render: (_, { producto }) => {
                //console.log(producto);
                return (
                    producto.descripcion
                );
            },
            //...getColumnSearchProps('producto'),
        },
        {
            title: 'Canridad',
            dataIndex: 'cantidad_total',
            width: '12%',
            //editable: true,
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            width: '10%',
            editable: true,
            render: (_, { estado, idinventario }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idinventario} >
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
                            onClick={() => save(record.idinventario, record)}
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
                            onConfirm={() => confirmDel(record.iddet_inventario,record.cantidad,record.idinventario)}
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
            title: 'iddetalle',
            dataIndex: 'iddet_inventario',
            key: 'iddet_inventario',
            width: '2%',
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
            width: '2%',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            width: '2%',
            render: (_, { estado, idinventario }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'blue' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idinventario} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
            },
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
        setEditingKey(record.idinventario);
    };


    const isEditing = (record) => record.idinventario === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (iddet_inventario,cantidad,idinventario) => {
        message.success('Procesando');
        //deleteInventario(idinventario);
        //deleteProducto(idinventario)
        deleteDetInventario(iddet_inventario,cantidad,idinventario)
    };

    const save = async (idinventario, record) => {
        //console.log('record:  ',record.img.length);
        //console.log(idinventario);
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idinventario === item.idinventario);

            if (index > -1) {
                const item = newData[index];
                //console.log(newData);

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                if (record.idinventario === item.idinventario) {
                    //console.log('Entra en asignacion',record.img);
                    newData[index].img = record.img;
                }

                newData[index].fecha_upd = strFecha;

                //console.log(newData);

                updateInventario(newData[index]);
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
            <h3>Inventario</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearinv')} >{<PlusOutlined />} Cargar</Button>
            </div>
            <TableModelExpand columnDet={columnDet} keyDet={'iddet_inventario'} token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idinventario'} />
        </>
    )
}
export default ListaInventario;