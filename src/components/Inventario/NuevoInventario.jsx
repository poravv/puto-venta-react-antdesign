

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input } from 'antd';
import Buscador from '../Buscador/Buscador';
import { Row, Col, message } from 'antd';
import { IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';

const URI = 'http://186.158.152.141:3001/sisweb/api/inventario/';
const URIINVDET = 'http://186.158.152.141:3001/sisweb/api/detinventario/';
const URIPROD = 'http://186.158.152.141:3001/sisweb/api/producto/';

//let fechaActual = new Date();

function NuevoInventario({ token, idsucursal }) {

    const fechaActual = new Date();
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();

    //console.log(strFecha);
    const navigate = useNavigate();
    const [tblinventariotmp, setTblInventarioTmp] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productoSelect, setProductoSelect] = useState(null);

    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
        getProductos();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getProductos = async () => {
        const res = await axios.get(`${URIPROD}get`, config);
        setProductos(res.data.body);
    }

    const actualizaCab = async (idinventario, valores) => {
        //console.log("Entra en actualizaCab");
        return await axios.put(URI + "put/" + idinventario, valores, config);
        //console.log(invCabecera);
    }

    const guardaDetalle = async (valores) => {
        await axios.post(URIINVDET + "post/", valores, config);
        navigate('/inventario');
    }

    const getProductoId = async (idinventario) => {
        return await axios.get(`${URI}getidproducto/${idinventario}-${idsucursal}`, config);
    }

    //procedimiento para actualizar
    const gestionGuardado = async () => {
        //e.preventDefault();

        /*
        1- Armar un loop para recorrer cada registro -ok
        2- Buscar si existe un registro de la cabecera por el producto
        3-Insertar cabecera si no existe y actualizar si es que existe
        */

        tblinventariotmp.map((inventario) => {

            getProductoId(inventario.idproducto).then((value) => {
                try {
                    actualizaCab(value.data.body[0].idinventario, {
                        idinventario: value.data.body[0].idinventario,
                        estado: value.data.body[0].estado,
                        //idproducto: value.data.body[0].idproducto,
                        //idsucursal: idsucursal,
                        cantidad_total: (parseInt(value.data.body[0].cantidad_total) + parseInt(inventario.cantidad)),
                        //cantidad_ven: value.data.body[0].cantidad_ven,
                    }).then((cabecera) => {
                        //console.log('El id es: ', cabecera);
                        //Guardado del detalle
                        guardaDetalle({
                            cantidad: inventario.cantidad,
                            estado: 'AC',
                            idinventario: value.data.body[0].idinventario,
                            fecha_insert: strFecha,
                            fecha_upd: strFecha,
                        });
                    });
                } catch (error) {
                    console.log(error)
                    message.error('Error en el registro');
                }
                message.success('Registro almacenado');
            });

            return true;
        });
    }

    const agregarLista = async (e) => {
        e.preventDefault();


        if (productoSelect === null) {
            message.error('Vuelva a seleccionar un producto');
            return false;
        }

        if (cantidad === 0 && cantidad === null && cantidad === '') {
            message.error('Cargue la cantidad');
            return false;
        }

        const validExist = tblinventariotmp.filter((inv) => inv.idproducto === productoSelect.idproducto??null);
        //console.log(productoSelect);

        if (validExist.length !== 0) {
            message.error('El producto ya existe en la lista');
            return false;
        }

        tblinventariotmp.push({
            idproducto: productoSelect.idproducto,
            producto: productoSelect,
            cantidad: cantidad
        });
        setTblInventarioTmp(tblinventariotmp);
        //setProductoSelect(null);
        //setCantidad(0);
    }

    const onChange = (value) => {
        //console.log('entra: ',value);
        productos.find((element) => {
            if (element.idproducto === value) {
                //console.log(element);
                setProductoSelect(element);
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };



    const extraerRegistro = (id) => {
        //console.log('Entra en delete', id);
        const updtblInventario = tblinventariotmp.filter(inv => inv.idproducto !== id);
        setTblInventarioTmp(updtblInventario);
    };

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/inventario');
    }


    return (
        <>
            <div style={{ marginBottom: `20px` }}>
                <h2>Cargar inventario</h2>
            </div>
            <div>
                <Form
                    //style={{ backgroundColor: `gray` }}
                    initialValues={{ remember: true, }}
                    onFinish={gestionGuardado}
                    autoComplete="off" >

                    <Row style={{ justifyContent: `center`, margin: `10px` }}>
                        <Col style={{ marginLeft: `15px` }}>
                            <Buscador label={'descripcion'} title={'Producto'} value={'idproducto'} data={productos} onChange={onChange} onSearch={onSearch} />
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="cantidad" rules={[{ required: true, message: 'Cargue cantidad', },]}>
                                <Input type='number' placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Button type="primary" htmlType="submit" onClick={(e) => agregarLista(e)} >
                                Agregar
                            </Button>
                        </Col>
                    </Row>
                    <div style={{ alignItems: `center`, justifyContent: `center`, margin: `0px`, display: `flex` }}>
                        <Table striped bordered hover>
                            <thead className='table-primary'>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tblinventariotmp.length !== 0 ? tblinventariotmp.map((inv) => (
                                    <tr key={inv.idproducto}>
                                        <td> {inv.producto.descripcion} </td>
                                        <td> {inv.cantidad} </td>
                                        <td>
                                            <button onClick={() => extraerRegistro(inv.idproducto)} className='btn btn-danger'><IoTrashOutline /></button>
                                        </td>
                                    </tr>
                                )) : null
                                }
                            </tbody>
                        </Table>
                    </div>

                    <Row style={{ alignItems: `center`, justifyContent: `center` }}>
                        <Form.Item style={{ margin: `20px` }}>
                            <Button type="primary" htmlType="submit" style={{ margin: `20px` }} >
                                Guardar
                            </Button>
                            <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                                Cancelar
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
        </>
    );
}

export default NuevoInventario;
