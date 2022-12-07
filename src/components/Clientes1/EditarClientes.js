import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../CSS/Cuerpo.css';
import BuscadorDato from "../Buscador/Buscador1";
import AlertModal from '../Utils/AlertModal';
import Form from 'react-bootstrap/Form';

const URI = 'http://186.158.152.141:3001/sisweb/api/cliente/';
const URICIUDAD = 'http://186.158.152.141:3001/sisweb/api/ciudad/';
let fechaActual = new Date();


const EditarCliente = ({ token, idusuario }) => {

    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [razon_social, setRazonSocial] = useState('')
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [estado, setEstado] = useState('');
    const [correo, setCorreo] = useState('');
    const [tipoCli, setTipoCli] = useState('');
    const [sexo, setSexo] = useState('');

    //Buscador
    const [ciudadSeleccionada, setciudadSeleccionada] = useState(null);
    const [valueCiudad, setvalueCiudad] = useState("");

    const navigate = useNavigate();

    const { id } = useParams();

    //Llamada a alerta y su mensaje
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [mensaje, setMensaje] = useState(null);

    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    //procedimiento para actualizar
    const update = async (e) => {
        e.preventDefault();

        if (razon_social.trim === '' || ruc.trim === '' || ruc.length < 6 || telefono.trim === '' || idusuario === null || ciudadSeleccionada === null || tipoCli === '') {
            setMensaje('Complete informacion requerida')
            setTimeout(() => {
                setMensaje(null)
            }, 8000);
            handleShow();
            return null;
        }

        await axios.put(URI + "put/" + id, {
            razon_social: razon_social,
            ruc: ruc,
            direccion: direccion,
            telefono: telefono,
            idusuario_upd: idusuario,
            fecha_upd: strFecha,
            fecha_insert: strFecha,
            estado: estado,
            correo: correo,
            idciudad: ciudadSeleccionada.idciudad,
            sexo: sexo
        }, config
        );

        navigate('/cliente');
    }

    useEffect(() => {
        getClienteId();
        // eslint-disable-next-line
    }, [])

    const getClienteId = async () => {
        const res = await axios.get(URI + "get/" + id, config);

        setRazonSocial(res.data.body.razon_social);
        setRuc(res.data.body.ruc);
        setDireccion(res.data.body.direccion);
        setTelefono(res.data.body.telefono);
        setCorreo(res.data.body.correo);
        setEstado(res.data.body.estado);
        setciudadSeleccionada(res.data.body.ciudad);
        setvalueCiudad(res.data.body.ciudad.descripcion);
        setTipoCli(res.data.body.tipo_cli);
        setSexo(res.data.body.sexo);


    }




    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/cliente');
    }



    const cambioCheck = (e) => {
        const { id } = e.target;
        setTipoCli(id);
    }

    const cambioCheckSexo = (e) => {
        const { id } = e.target;
        setSexo(id);
    }

    return (
        <div className="cuerpo">
            <form onSubmit={update} >
                <div style={{ margin: `20px` }}>
                    <h2>Crear cliente</h2>
                </div>
                <div className="mb-3">
                    <label className="form-label">Razon Social / Nombre (*)</label>
                    <input value={razon_social} onChange={(e) => setRazonSocial(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ruc (*)</label>
                    <input value={ruc} onChange={(e) => setRuc(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Direccion (*)</label>
                    <input value={direccion} onChange={(e) => setDireccion(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Telefono (*)</label>
                    <input value={telefono} onChange={(e) => setTelefono(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo (*)</label>
                    <input value={correo} onChange={(e) => setCorreo(e.target.value)} type="text" className="form-control" />
                </div>

                <label className="form-label">Tipo de cliente (*)</label>
                <div style={{ display: `flex`, alignItems: `center`, justifyContent: `center` }} key={`radio`} id={'radio'} className="mb-3">

                    <Form.Check
                        style={{ margin: `5px` }}
                        type={'radio'}
                        id={`F`}
                        label={`Fisico`}
                        name='radio'
                        checked={tipoCli === 'F' ? true : false}
                        onChange={cambioCheck}
                    />

                    <Form.Check
                        style={{ margin: `5px` }}
                        type={'radio'}
                        id={`J`}
                        label={`Juridico`}
                        name='radio'
                        checked={tipoCli === 'J' ? true : false}
                        onChange={cambioCheck}
                    />
                </div>

                {
                    tipoCli === 'F' ?
                        <>
                            <label className="form-label">Sexo</label>
                            <div style={{ display: `flex`, alignItems: `center`, justifyContent: `center` }} key={`radio`} id={'radio'} className="mb-3">

                                <Form.Check
                                    style={{ margin: `5px` }}
                                    type={'radio'}
                                    id={`MA`}
                                    label={`Masculino`}
                                    name='sexo'
                                    checked={sexo === 'MA' ? true : false}
                                    onChange={cambioCheckSexo}
                                />

                                <Form.Check
                                    style={{ margin: `5px` }}
                                    type={'radio'}
                                    id={`FE`}
                                    label={`Femenino`}
                                    name='sexo'
                                    checked={sexo === 'FE' ? true : false}
                                    onChange={cambioCheckSexo}
                                />
                            </div>
                        </>

                        : null
                }

                <div className="mb-3">
                    <label className="form-label">Ciudad (*)</label>
                    <BuscadorDato setDatoSeleccionado={setciudadSeleccionada} uri={URICIUDAD + "get/"} config={config} campo={'Ciudad'} setValue={setvalueCiudad} value={valueCiudad} />
                </div>

                <div style={{ alignItems: `center`, justifyContent: `center`, display: `flex` }}>
                    {mensaje ? <AlertModal tipoMensaje={'danger'} mensaje={mensaje} show={show} handleClose={handleClose} /> : null}
                </div>

                <div style={{ margin: `30px` }}>
                    <button style={{ margin: `10px` }} type="submit" className="btn btn-primary">Agregar</button>
                    <button style={{ margin: `10px` }} onClick={btnCancelar}
                        className="btn btn-primary">Cancelar</button>
                </div>
            </form>
        </div>
    )

}

export default EditarCliente