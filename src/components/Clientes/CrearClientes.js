import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/Cuerpo.css';
import '../../CSS/Buscador.css';
import BuscadorDato from "../Buscador/Buscador1";
import AlertModal from '../Utils/AlertModal';
import Form from 'react-bootstrap/Form';

const URI = 'http://186.158.152.141:3001/sisweb/api/cliente/';
const URICIUDAD = 'http://186.158.152.141:3001/sisweb/api/ciudad/';
let fechaActual = new Date();

const CrearCliente = ({ token, idusuario }) => {
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [razon_social, setRazonSocial] = useState('')
    const [ruc, setRuc] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [tipoCli, setTipoCli] = useState('');
    const [sexo, setSexo] = useState('');
    const navigate = useNavigate();

    //Llamada a alerta y su mensaje
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [mensaje, setMensaje] = useState(null);

    //Buscador
    const [ciudadSeleccionada, setciudadSeleccionada] = useState(null);
    const [valueCiudad, setvalueCiudad] = useState("");



    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };


    //procedimiento para actualizar
    const create = async (e) => {
        e.preventDefault();


        if (razon_social.trim === '' || ruc.trim === '' || ruc.length < 6 || telefono.trim === '' || idusuario === null || ciudadSeleccionada === null || tipoCli === '') {
            setMensaje('Complete informacion requerida')
            setTimeout(() => {
                setMensaje(null)
            }, 8000);
            handleShow();
            return null;
        }


        await axios.post(URI + "post/", {
            razon_social: razon_social,
            ruc: ruc,
            direccion: direccion,
            telefono: telefono,
            idusuario_upd: idusuario,
            fecha_insert: strFecha,
            estado: "AC",
            correo: correo,
            idciudad: ciudadSeleccionada.idciudad,
            tipo_cli: tipoCli,
            sexo: sexo
        }, config
        ).then((rs) => {

            //console.log(rs);

            if (rs.data.error) {
                setMensaje('Error en la creacion del cliente, verifique los datos ingresados.')
                setTimeout(() => {
                    setMensaje(null)
                }, 8000);
                handleShow();
                return null;
            }
            navigate('/cliente');
        });

    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/cliente');
    }




    const cambioCheck = (e) => {
        //e.preventDefault();
        const { id } = e.target;
        //console.log(id,checked)
        setTipoCli(id);
    }

    const cambioCheckSexo = (e) => {
        //e.preventDefault();
        const { id } = e.target;
        //console.log(id)
        setSexo(id);
    }

    return (
        <div className="cuerpo">
            <form onSubmit={create} >
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
                        onChange={cambioCheck}
                    />

                    <Form.Check
                        style={{ margin: `5px` }}
                        type={'radio'}
                        id={`J`}
                        label={`Juridico`}
                        name='radio'
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
                                    onChange={cambioCheckSexo}
                                />

                                <Form.Check
                                    style={{ margin: `5px` }}
                                    type={'radio'}
                                    id={`FE`}
                                    label={`Femenino`}
                                    name='sexo'
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

export default CrearCliente;