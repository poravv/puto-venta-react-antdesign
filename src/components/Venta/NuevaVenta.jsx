

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input } from 'antd';
import Buscador from '../Buscador/Buscador';
import { Row, Col, message } from 'antd';
import { IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';

const URI = 'http://186.158.152.141:3001/sisweb/api/venta/';
const URIINVDET = 'http://186.158.152.141:3001/sisweb/api/detventa/';
const URIPRODUCTO = 'http://186.158.152.141:3001/sisweb/api/producto_final/';
const URICLI = 'http://186.158.152.141:3001/sisweb/api/cliente/';

let fechaActual = new Date();

function NuevaVenta({ token, idusuario, idsucursal }) {

    //Parte de nuevo registro por modal
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [tblventatmp, setTblVentaTmp] = useState([]);
    const [cantidad, setCantidad] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalIva, setTotalIva] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [productoSelect, setProductoSelect] = useState(0);
    const [idcliente, setIdCliente] = useState(0);
    const navigate = useNavigate();
    const [lstProducto, setLstProducto] = useState([]);
    const [lstClientes, setLstClientes] = useState([]);

    useEffect(() => {
        getProductos();
        getClientes();
        verificaproceso();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getProductos = async () => {
        const res = await axios.get(`${URIPRODUCTO}get`, config);
        setLstProducto(res.data.body);
    }

    const getClientes = async () => {
        const res = await axios.get(`${URICLI}get`, config);
        setLstClientes(res.data.body);
    }

    const verificaproceso = async () => {
        return await axios.post(URI + `verificaproceso/${idusuario}-inventario`, {}, config);
    }

    const guardaCab = async (valores) => {
        return await axios.post(URI + "post/", valores, config);
    }

    const guardaDetalle = async (valores) => {
        await axios.post(URIINVDET + "post/", valores, config);
    }
    const operacionVenta = async (idproducto_final) => {
        //console.log(idproducto_final,'-',idusuario,'-',0);
        return await axios.post(URI + `operacionventa/${idproducto_final}-procesado-${idusuario}-0`, {}, config);
    }


    //procedimiento para actualizar
    const gestionGuardado = async () => {
        try {
            guardaCab(
                {
                    idusuario: idusuario,
                    idcliente: idcliente,
                    estado: 'AC',
                    fecha: strFecha,
                    iva_total: totalIva,
                    total: total,
                    costo_envio: 0,
                    nro_comprobante: 0
                }
            ).then((cabecera) => {
                try {
                    //console.log('Entra en guarda detalle')
                    //Guardado del detalle
                    tblventatmp.map((venta) => {
                        guardaDetalle({
                            cantidad: venta.cantidad,
                            idproducto_final: venta.producto_final.idproducto_final,
                            estado: venta.producto_final.estado,
                            descuento: venta.descuento,
                            idventa: cabecera.data.body.idventa,
                            subtotal: venta.producto_final.costo * venta.cantidad,
                        });
                        operacionVenta(venta.producto_final.idproducto_final);
                        return null;
                    });

                } catch (error) {
                    console.log(error);
                    message.error('Error en la creacion');
                    return null;
                }
                navigate('/venta');
            });
            message.success('Registro almacenado');
        } catch (e) {
            console.log(e);
            message.error('Error en la creacion');
            return null;
        }

    }

    const agregarLista = async (e) => {

        e.preventDefault();

        //Validacion de existencia del producto dentro de la lista 
        //const productoSelect = lstProducto.filter((inv) => inv.idproducto_final === idproductoSelect);
        const validExist = tblventatmp.filter((inv) => inv.idproducto_final === productoSelect.idproducto_final);

        if (productoSelect !== null) {
            if (cantidad !== 0 && cantidad !== null && cantidad !== '') {
                if (validExist.length === 0) {

                    //La idea es hacer que en el server se haga el calculo de si existe o no el stock por el producto
                    console.log(productoSelect.obs);
                    if (productoSelect.obs !== 'STOCK') {
                        message.warning('No hay stock para este producto');
                        return;
                    }

                    //console.log('Cantidad posible ', productoSelect.cant_prod_posible);
                    //console.log('Cantidad requerida ', cantidad);

                    if (parseInt(cantidad) <= parseInt(productoSelect.cant_prod_posible)) {

                        try {
                            await axios.post(URI + `operacionventa/${productoSelect.idproducto_final}-venta-${idusuario}-${cantidad}`, {}, config);
                        } catch (error) {
                            console.log('Error: ', error);
                        }

                        //console.log(productoSelect);


                        tblventatmp.push({
                            idproducto_final: productoSelect.idproducto_final,
                            producto_final: productoSelect,
                            cantidad: cantidad,
                            descuento: descuento
                        });

                        setTotal(total + (cantidad * productoSelect.costo) - descuento);
                        setTotalIva(totalIva + (cantidad * productoSelect.monto_iva));

                    } else {
                        message.warning('No hay stock para la cantidad requerida');
                    }

                } else {
                    message.warning('El producto ya existe en el listado');
                }
            } else {
                message.warning('Cargue cantidad de producto');
            }
        } else {
            message.warning('Seleccione un producto');
        }
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/producto');
    }

    const onChangeProducto = (value) => {

        lstProducto.find((element) => {
            if (element.idproducto_final === value) {
                //console.log(element);
                setProductoSelect(element)
                return true;
            } else {
                return false;
            }
        });
    };

    const onChangeCliente = (value) => {

        lstClientes.find((element) => {
            if (element.idcliente === value) {
                //console.log(element);
                setIdCliente(element)
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const extraerRegistro = async (id, costo, monto_iva) => {

        //console.log('Entra en delete', id);

        const updtblVenta = tblventatmp.filter(inv => inv.idproducto_final !== id);
        setTblVentaTmp(updtblVenta);

        try {
            await axios.post(URI + `operacionventa/${id}-retorno-${idusuario}-0`, {}, config);
        } catch (error) {
            console.log('Error: ', error);
        }

        setTotal(total - costo);
        setTotalIva(totalIva - monto_iva);

    };

    return (
        <>
            <div style={{ marginBottom: `20px` }}>
                <h2>Nueva orden</h2>
            </div>
            <div>
                <Form
                    //style={{ backgroundColor: `gray` }}
                    initialValues={{ remember: true, }}
                    onFinish={gestionGuardado}
                    autoComplete="off">
                    <Row style={{ justifyContent: `center` }}>
                        <Col style={{ marginLeft: `15px` }}>
                            <Buscador label={'cliente'} title={'Cliente'} value={'idcliente'} data={lstClientes} onChange={onChangeCliente} onSearch={onSearch} />
                        </Col>
                    </Row>


                    <Row style={{ justifyContent: `center`, margin: `10px` }}>
                        <Col style={{ marginLeft: `15px` }}>
                            <Buscador label={'nombre'} title={'Producto'} value={'idproducto'} data={lstProducto} onChange={onChangeProducto} onSearch={onSearch} />
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="cantidad" rules={[{ required: true, message: 'Cargue cantidad', },]}>
                                <Input type='number' placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="cantidad" rules={[{ required: true, message: 'Cargue cantidad', },]}>
                                <Input type='number' placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="descuento" >
                                <Input type='number' placeholder='Descuento' value={descuento} onChange={(e) => setDescuento(e.target.value)} />
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
                                    <th>Costo</th>
                                    <th>Cantidad</th>
                                    <th>Descuento</th>
                                    <th>Iva</th>
                                    <th>Monto Iva</th>
                                    <th>Subtotal iva</th>
                                    <th>Subtotal</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tblventatmp.length !== 0 ? tblventatmp.map((inv) => (
                                    <tr key={inv.idproducto_final}>
                                        <td> {inv.producto_final.nombre} </td>
                                        <td> {inv.producto_final.costo} </td>
                                        <td> {inv.cantidad} </td>
                                        <td> {inv.descuento} </td>
                                        <td> {inv.producto_final.tipo_iva + '%'} </td>
                                        <td> {inv.producto_final.monto_iva} </td>
                                        <td> {inv.producto_final.monto_iva * inv.cantidad} </td>
                                        <td> {inv.producto_final.costo * inv.cantidad} </td>
                                        <td>
                                            <button onClick={() => extraerRegistro(inv.idproducto_final, (inv.producto_final.costo - descuento), inv.producto_final.monto_iva)} className='btn btn-danger'><IoTrashOutline /></button>
                                        </td>
                                    </tr>
                                )) : null
                                }
                            </tbody>
                            <tfoot >
                                <tr>
                                    <th>Total</th>
                                    <th style={{ textAlign: `start` }} colSpan={7}>
                                        <b>{total}</b>
                                    </th>
                                </tr>
                                <tr>
                                    <th>Total iva</th>
                                    <th style={{ textAlign: `start` }} colSpan={7}>
                                        <b>{totalIva}</b>
                                    </th>
                                </tr>
                            </tfoot>
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

export default NuevaVenta;
