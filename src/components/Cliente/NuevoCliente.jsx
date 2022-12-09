

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react';
import { Button, Form, Input, Radio,message } from 'antd';
import Buscador from '../Buscador/Buscador';

const URI = 'http://186.158.152.141:3001/sisweb/api/cliente/';
const URIPROV = 'http://186.158.152.141:3001/sisweb/api/ciudad/';
let fechaActual = new Date();

function NuevoCliente({ token, idusuario }) {

    //Parte de nuevo registro por modal
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [razon_social, setRazonSocial] = useState('')
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [tipoCli, setTipoCli] = useState('');
    const [sexo, setSexo] = useState('');
    const [idciudad, setIdciudad] = useState(0);
    const navigate = useNavigate();
    const [ciudades, setCiudades] = useState([]);

    const onChangeSexo = (e) => {
        console.log('radio checked', e.target.value);
        setSexo(e.target.value);
    };

    const onChangeTipocli = (e) => {
        console.log('radio checked', e.target.value);
        setTipoCli(e.target.value);

        if(e.target.value==="J"){
            setSexo('');
            console.log(sexo)
        }
    };

    useEffect(() => {
        getCiudad();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getCiudad = async () => {
        const res = await axios.get(`${URIPROV}get`, config);
        setCiudades(res.data.body);
        //console.log(res.data.body);
    }
    /*
        const base64ToArrayBuffer = (base64) => {
            var encodedString = new Uint8Array(Buffer.from(base64, 'base64'));
            console.log(encodedString);
        }
    */


    //procedimiento para actualizar
    const create = async (e) => {

        await axios.post(URI + "post/", {
            razon_social: razon_social,
            ruc: ruc,
            direccion: direccion,
            telefono: telefono,
            idusuario_upd: idusuario,
            fecha_insert: strFecha,
            estado: "AC",
            correo: correo,
            idciudad: idciudad,
            tipo_cli: tipoCli,
            sexo: sexo
        }, config
        ).then((rs) => {
            if (rs.data.error) {
                message.error('Error en la creacion del cliente, verifique los datos ingresados');
                return null;
            }
            navigate('/cliente');
        });
        navigate('/cliente');
        message.success('Registro almacenado');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/cliente');
    }

    const onChange = (value) => {
        setIdciudad(value)
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    return (
        <div >
            <div style={{ marginBottom: `20px` }}>
                <h2>Nuevo cliente</h2>
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

                <Form.Item name="razon_social" rules={[{ required: true, message: 'Cargue razon social', },]}>
                    <Input placeholder='Razon social' value={razon_social} onChange={(e) => setRazonSocial(e.target.value)} />
                </Form.Item>

                <Form.Item name="ruc" rules={[{ required: true, message: 'Cargue ruc', },]}>
                    <Input placeholder='Ruc' value={ruc} onChange={(e) => setRuc(e.target.value)} />
                </Form.Item>

                <Form.Item name="direccion" rules={[{ required: true, message: 'Cargue direccion', },]}>
                    <Input placeholder='Direccion' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Item>

                <Form.Item name="telefono" rules={[{ required: true, message: 'Cargue telefono', },]}>
                    <Input placeholder='Telefono' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </Form.Item>

                <Form.Item name="correo" rules={[{ required: true, message: 'Cargue correo', },]}>
                    <Input placeholder='Correo' value={correo} onChange={(e) => setCorreo(e.target.value)} />
                </Form.Item>

                <Form.Item name="tipocli" rules={[{ required: true, message: 'Cargue Tipo de cliente', },]}>
                    <Radio.Group name="tipocli" onChange={onChangeTipocli} value={tipoCli}>
                        <Radio value={'F'}>Fisico</Radio>
                        <Radio value={'J'}>Juridico</Radio>
                    </Radio.Group>
                </Form.Item>

                {
                    tipoCli === "F" ?
                        <Form.Item name="sexo" rules={[{ required: true, message: 'Cargue sexo', },]}>
                            <Radio.Group name="sexo" onChange={onChangeSexo} value={sexo}>
                                <Radio value={'MA'}>Masculino</Radio>
                                <Radio value={'FE'}>Femenino</Radio>
                            </Radio.Group>
                        </Form.Item>
                        : null
                }

                <Buscador title={'Ciudad'} label={'descripcion'} value={'idciudad'} data={ciudades} onChange={onChange} onSearch={onSearch} />

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

export default NuevoCliente;
