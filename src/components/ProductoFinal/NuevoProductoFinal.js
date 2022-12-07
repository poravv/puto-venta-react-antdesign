

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input } from 'antd';
import Buscador from '../Buscador/Buscador';
import UploadFile from '../Utils/Upload';
import { Radio, Row, Col } from 'antd';
import { IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';

const URI = 'http://186.158.152.141:3001/sisweb/api/producto_final/';
const URIRECETA = 'http://186.158.152.141:3001/sisweb/api/receta/';
const URIARTICULO = 'http://186.158.152.141:3001/sisweb/api/producto/';

//let fechaActual = new Date();

function NuevoProductoFinal({ token, idusuario }) {

    //Parte de nuevo registro por modal
    //const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [tipo_iva, setTipo_iva] = useState(0);
    const navigate = useNavigate();
    const [producto, setProducto] = useState([]);
    const [tblproducto_finaltmp, setTblProductoFinalTmp] = useState([]);
    const [cantidad, setCantidad] = useState(0);
    const [total, setTotal] = useState(0);
    const [mensaje, setMensaje] = useState(null);
    const [articuloSelect, setArticuloSelect] = useState(null);

    //Para imagen
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        getArticulo();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getArticulo = async () => {
        const res = await axios.get(`${URIARTICULO}get`, config);
        setProducto(res.data.body);
    }

    const guardaCab = async (valores) => {
        //console.log("Entra en guardaCab");
        //Guardado de cabecera
        return await axios.post(URI + "post/", valores, config);
        //console.log(invCabecera);
    }

    const guardarReceta = async (valores) => {
        await axios.post(URIRECETA + "post/", valores, config);
        navigate('/producto');
    }


    //procedimiento para actualizar
    const gestionGuardado = async () => {
        /*
        1- Armar un loop para recorrer cada registro -ok
        2- Buscar si existe un registro de la cabecera por el producto
        3-Insertar cabecera si no existe y actualizar si es que existe
        */
        if (nombre === "" || descripcion === '' || costo <= 0 || tipo_iva === 0 || tblproducto_finaltmp.length<=0) {
            setMensaje('Verificar valores cargados.')
            setTimeout(() => {
                setMensaje(null)
            }, 8000);
            return;
        }
        try {
            guardaCab(
                {
                    estado: 'AC',
                    nombre: nombre,
                    descripcion: descripcion,
                    costo: costo,
                    tipo_iva: tipo_iva,
                    img:previewImage
                }
            ).then((cabecera) => {
                if (cabecera.data.error) {
                    setMensaje('Error en el guardado, verifique que el producto ya no exista.')
                    setTimeout(() => {
                        setMensaje(null)
                    }, 8000);
                    return;
                }
                //Guardado del detalle
                    try {
                        //console.log(tblproducto_finaltmp.length);

                        tblproducto_finaltmp.map((producto) => {
                            
                        guardarReceta({
                            idproducto_final: cabecera.data.body.idproducto_final,
                            receta_estado: 'AC',
                            estado: producto.producto.estado,
                            idproducto: producto.producto.idproducto,
                            cantidad: producto.cantidad
                        });
                        
                        //console.log(producto);

                        return null;
                    });
                    } catch (error) {
                        console.log(error);
                        return null;
                    }
            });
        } catch (e) {
            console.log(e);
        }
    }

    const agregarLista = async (e) => {
        e.preventDefault();

        //console.log(tblproducto_finaltmp)
        let validExist;
        try {
            validExist = tblproducto_finaltmp.filter((inv) => inv.idproducto === articuloSelect.idproducto);
        } catch (error) {
            setMensaje('Seleccione un producto')
            setTimeout(() => {
                setMensaje(null)
            }, 8000);
        }

        //console.log(articuloSelect);
        if (articuloSelect !== null) {
            if (cantidad !== 0 && cantidad !== null && cantidad !== '') {
                if (validExist.length === 0) {

                    tblproducto_finaltmp.push({
                        idproducto: articuloSelect.idproducto,
                        producto: articuloSelect,
                        cantidad: cantidad
                    });
                    setTotal(total + (cantidad * articuloSelect.precio))
                    setArticuloSelect(null);
                } else {
                    setMensaje('El producto ya existe en la lista')
                    setTimeout(() => {
                        setMensaje(null)
                    }, 8000);
                }
            } else {
                setMensaje('Cargue la cantidad')
                setTimeout(() => {
                    setMensaje(null)
                }, 8000);
            }
        } else {
            setMensaje('Selecciona un producto')
            setTimeout(() => {
                setMensaje(null)
            }, 5000);
        }
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/producto');
    }

    const onChange = (value) => {

        producto.find((element) => {
            if (element.idproducto === value) {
                //console.log(element);
                setArticuloSelect(element);
                return true;
            } else {
                return false;
            }
        });
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    const extraerRegistro = (id, costo) => {
        //console.log('Entra en delete', id);
        setTotal(total - costo);
        tblproducto_finaltmp.filter(inv => inv.idproducto !== id);
        const updtblProductoFinal = tblproducto_finaltmp.filter(inv => inv.idproducto !== id);
        setTblProductoFinalTmp(updtblProductoFinal);
    };

    return (
        <>
            <div style={{ marginBottom: `20px` }}>
                <h2>Nuevo producto</h2>
            </div>
            <div>
                <Form
                    //style={{ backgroundColor: `gray` }}
                    initialValues={{ remember: true, }}
                    onFinish={gestionGuardado}
                    autoComplete="off" >
                    <Row style={{ justifyContent: `center` }}>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="nombre" rules={[{ required: true, message: 'Cargue nombre', },]}>
                                <Input name='nombre' placeholder='Nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="descripcion" rules={[{ required: true, message: 'Cargue descripcion', },]}>
                                <Input name='descripcion' placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="precio" rules={[{ required: true, message: 'Cargue precio', },]}>
                                <Input name="precio" type='number' placeholder='Precio' value={costo} onChange={(e) => setCosto(e.target.value)} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ alignItems: `center`, justifyContent: `center`, margin: `0px` }}>
                        <Form.Item label='Tipo iva:'  rules={[{ required: true, message: 'Seleccione tipo de iva', },]} />
                        <Radio.Group onChange={(e) => setTipo_iva(e.target.value)} value={tipo_iva}>
                            <Radio value={5}>5%</Radio>
                            <Radio value={10}>10%</Radio>
                        </Radio.Group>

                        <Form.Item name="imagen" style={{ margin: `10px` }}  >
                            <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} />
                        </Form.Item>
                    </Row>
                
                
                    <Row style={{ justifyContent: `center`, margin: `10px` }}>
                        <Col style={{ marginLeft: `15px` }}>
                            <Buscador label={'descripcion'} title={'Articulo'} value={'idproducto'} data={producto} onChange={onChange} onSearch={onSearch} />
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Form.Item name="cantidad" rules={[{ required: true, message: 'Cargue cantidad', },]}>
                                <Input type='number' placeholder='Cantidad' value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Button type="primary" htmlType="submit" onClick={(e)=>agregarLista(e)} >
                                Agregar
                            </Button>
                        </Col>
                    </Row>
                    <div style={{ alignItems: `center`, textAlign: `center`, justifyContent: `center`, display: `flex` }}>
                        {mensaje ? <label style={{ color: `red` }}>{mensaje}</label> : null}
                    </div>
                    <div style={{ alignItems: `center`, justifyContent: `center`, margin: `0px`, display: `flex` }}>
                        <Table striped bordered hover>
                            <thead className='table-primary'>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: `white` }}>
                                {tblproducto_finaltmp.length !== 0 ? tblproducto_finaltmp.map((inv) => (
                                    <tr key={inv.idproducto}>
                                        <td> {inv.producto.descripcion} </td>
                                        <td> {inv.cantidad} </td>
                                        <td> {inv.cantidad * inv.producto.precio} </td>
                                        <td>
                                            <button onClick={() => extraerRegistro(inv.idproducto, (inv.cantidad * inv.producto.precio))} className='btn btn-danger'><IoTrashOutline /></button>
                                        </td>
                                    </tr>
                                )) : null
                                }
                            </tbody>
                            <tfoot style={{ backgroundColor: `white` }}>
                                <tr>
                                    <th>Total</th>
                                    <th colSpan={3}>
                                        <b>{total}</b>
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

export default NuevoProductoFinal;
