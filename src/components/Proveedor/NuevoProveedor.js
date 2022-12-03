

import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from 'react';
import { Button, Form, Input } from 'antd';


const URI = 'http://186.158.152.141:3001/sisweb/api/proveedor/';
let fechaActual = new Date();

function NuevoProveedor({ token, idusuario }) {

    //Parte de nuevo registro por modal
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [razon_social, setRazonSocial] = useState('')
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const navigate = useNavigate();

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    //procedimiento para actualizar
    const create = async (e) => {
        //e.preventDefault();
        await axios.post(URI + "post/", {
            idproveedor: 0,
            razon_social: razon_social,
            ruc: ruc,
            direccion: direccion,
            telefono: telefono,
            idusuario_upd: idusuario,
            fecha_insert: strFecha,
            estado: "AC"
        }, config
        );
        navigate('/proveedor');
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/proveedor');
    }


    return (
        <div >
            <div style={{ marginBottom:`20px` }}>
                <h2>Nuevo proveedor</h2>
            </div>
            <Form
                name="basic"
                style={{ textAlign: `center` }}
                labelCol={{ span: 8, }}
                wrapperCol={{ span: 16, }}
                initialValues={{ remember: true, }}
                onFinish={create}
                //onFinishFailed={create}
                autoComplete="off"

            >

                <Form.Item name="razonsocial" rules={[{ required: true, message: 'Cargue razon social', },]}>
                    <Input placeholder='Razon social' value={razon_social} onChange={(e) => setRazonSocial(e.target.value)} />
                </Form.Item>

                <Form.Item name="ruc" rules={[{ required: true, message: 'Cargue ruc', },]}>
                    <Input placeholder='Ruc' value={ruc} onChange={(e) => setRuc(e.target.value)} />
                </Form.Item>

                <Form.Item name="direccion" rules={[{ required: true, message: 'Cargue direccion', },]}>
                    <Input placeholder='Direccion' value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                </Form.Item>

                <Form.Item name="telefono" rules={[{ required: true, message: 'Cargue telefono', },]}>
                    <Input placeholder='Telefono' value={telefono}  onChange={(e) => setTelefono(e.target.value)} />
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

export default NuevoProveedor;

/*

                

*/