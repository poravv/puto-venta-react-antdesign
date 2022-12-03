

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react';
import { Button, Form, Input } from 'antd';
import Buscador from '../Buscador/Buscador';
import UploadFile from '../Utils/Upload';
import { Radio } from 'antd';


const URI = 'http://186.158.152.141:3001/sisweb/api/producto_final/';
const URIPROV = 'http://186.158.152.141:3001/sisweb/api/proveedor/';
let fechaActual = new Date();

function NuevoProductoFinal({ token, idusuario }) {

    //Parte de nuevo registro por modal
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('');
    const [costo, setCosto] = useState('');
    const [tipo_iva, setTipo_iva] = useState('');
    const [idproveedor, setIdproveedor] = useState(0);
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    //Para imagen
    const [previewImage, setPreviewImage] = useState('');

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
        //base64ToArrayBuffer(previewImage)

        //console.log(Buffer.from(previewImage,'ascii'));
        //console.log(new Uint8Array(Buffer.from(previewImage,'base64')).toString());


        /*
        if (previewImage) {
            return false;
        }
        */


        if (previewImage === null || previewImage === "") {
            return false;
        }

        console.log(previewImage);

        await axios.post(URI + "post", {
            nombre: nombre,
            descripcion: descripcion,
            peso: 0,
            idproveedor: idproveedor,
            idusuario_upd: idusuario,
            fecha_insert: strFecha,
            fecha_upd: strFecha,
            estado: "AC",
            //img: new Uint8Array(Buffer.from(previewImage,'ascii')).toString()
            //img: new Uint8Array(Buffer.from(previewImage,'base64')).toString()
            img: previewImage
            //img: new Buffer.from(previewImage)
        }, config
        );
        navigate('/articulo');
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

                <Form.Item name="nombre" rules={[{ required: true, message: 'Cargue nombre', },]}>
                    <Input placeholder='Descripcion' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </Form.Item>
                <Form.Item name="descripcion" rules={[{ required: true, message: 'Cargue descripcion', },]}>
                    <Input placeholder='Descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </Form.Item>
                <Form.Item  name="precio" rules={[{ required: true, message: 'Cargue precio', },]}>
                    <Input type='number' placeholder='Precio' value={costo} onChange={(e) => setCosto(e.target.value)} />
                </Form.Item>
                <Buscador label={'razon_social'} value={'idproveedor'} data={proveedores} onChange={onChange} onSearch={onSearch} />
                

                <Form.Item style={{ margin: `10px` }} name="radio" rules={[{ required: true, message: 'Seleccione radio', },]}>
                    <Radio.Group onChange={(e) => setTipo_iva(e.target.value)} value={tipo_iva}>
                        <Radio value={5}>5%</Radio>
                        <Radio value={10}>10%</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item style={{ margin: `10px` }} name="imagen" >
                    <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} />
                </Form.Item>



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

export default NuevoProductoFinal;
