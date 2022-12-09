

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react';
import { Button, Form, Input,message } from 'antd';
import Buscador from '../Buscador/Buscador';

const URI = 'http://186.158.152.141:3001/sisweb/api/producto/';
const URIPROV = 'http://186.158.152.141:3001/sisweb/api/proveedor/';
let fechaActual = new Date();

function NuevoArticulo({ token, idusuario }) {

    //Parte de nuevo registro por modal
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [descripcion, setRazonSocial] = useState('')
    const [precio, setPrecio] = useState('');
    const [idproveedor, setIdproveedor] = useState(0);
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    
    useEffect(() => {
        getProveedor();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getProveedor = async () => {
        const res = await axios.get(`${URIPROV}get`, config);
        setProveedores(res.data.body);
    }
    /*
        const base64ToArrayBuffer = (base64) => {
            var encodedString = new Uint8Array(Buffer.from(base64, 'base64'));
            console.log(encodedString);
        }
    */


    //procedimiento para actualizar
    const create = async (e) => {
    
        await axios.post(URI + "post", {
            descripcion: descripcion,
            precio: precio,
            peso: 0,
            idproveedor: idproveedor,
            idusuario_upd: idusuario,
            fecha_insert: strFecha,
            fecha_upd: strFecha,
            estado: "AC",
            //img: previewImage
        }, config
        ).then((rs) => {
            if (rs.data.error) {
                message.error('Error en la creacion de articulo');
                return null;
            }
            navigate('/articulo');
        });
        navigate('/articulo');
        message.success('Registro almacenado');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/articulo');
    }

    const onChange = (value) => {
        setIdproveedor(value)
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Nuevo articulo</h2>
            </div>
            <Form
                name="basic"
                style={{ textAlign: `center` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                //onFinishFailed={create}
                autoComplete="off" >

                <Form.Item name="descripcion" rules={[{ required: true, message: 'Cargue descripcion', },]}>
                    <Input placeholder='Descripcion' value={descripcion} onChange={(e) => setRazonSocial(e.target.value)} />
                </Form.Item>

                <Form.Item name="precio" rules={[{ required: true, message: 'Cargue precio', },]}>
                    <Input type='number' placeholder='Precio' value={precio} onChange={(e) => setPrecio(e.target.value)} />
                </Form.Item>

                <Buscador title={'Proveedor'} label={'razon_social'} value={'idproveedor'} data={proveedores} onChange={onChange} onSearch={onSearch} />

                <Form.Item
                    style={{ margin: `20px` }}>
                    <Button type="primary" htmlType="submit" style={{ margin: `20px` }} >
                        Guardar
                    </Button>
                    <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default NuevoArticulo;

/*

                

*/