import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Paginador from '../Paginador/Paginador';
import { IoAddSharp, IoTrashOutline, IoPencil, IoHomeOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';
import {Logout} from '../Utils/Logout';


const URI = 'http://186.158.152.141:3001/sisweb/api/cliente/get'


const ListaCliente = ({ token }) => {
    

    const [cliente, setCliente] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState([]);
    const [labelFilter, setLabelFilter] = useState([]);
    const [rucFilter, setRucFilter] = useState([]);

    useEffect(() => {
        getCliente();
        // eslint-disable-next-line
    }, [])

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getCliente = async () => {
        const res = await axios.get(URI, config)
        setCliente(res.data.body);
        setFiltroCliente(res.data.body);
        /*En caso de que de error en el server direcciona a login*/
        if(res.data.error){
            Logout();
        }
        
    }

    const deleteCliente = async (id) => {
        await axios.delete(`${URI}/del/${id}`, config)
        getCliente();
    }
    //FUNCION FLECHA DE FILTRO
    const changeKeyLabel = (value) => {
        setLabelFilter(value);
        setCliente(filtroCliente.filter((dt) =>
            (dt.razon_social.indexOf(value) !== -1)
        ));
        //console.log(filtroCliente);
    }

    const changeKeyRucLabel = (value) => {
        setRucFilter(value);
        setCliente(filtroCliente.filter((dt) =>
            (dt.ruc.indexOf(value) !== -1)
        ));
        //console.log(filtroCliente);
    }

/**********************************************************/
/*************************Paginador************************/
/**********************************************************/
    const [paginaInicial,setPaginaInicial] = useState(1);
    const [registros] = useState(7);
    const indiceSiguiente = paginaInicial * registros;
    const indiceAnterior = indiceSiguiente - registros;
    const clientePaginado = cliente.slice(indiceAnterior,indiceSiguiente);

    //Cambio de pagina
    const paginate = (pageNumber) => setPaginaInicial(pageNumber);

/**********************************************************/
/************************Fin Paginador*********************/
/**********************************************************/


    return (
        <div className='container'>
            <div style={{ margin: `20px` }}>
                <h2>Clientes</h2>
            </div>
            <div className='row'>
                <div className='col'>
                <Table striped bordered hover>
                        <thead className='table-primary'>
                            <tr>
                                <th>
                                    Cliente
                                    <br />
                                    <input
                                        type="text"
                                        value={labelFilter}
                                        onChange={(e) =>
                                            changeKeyLabel(e.target.value)
                                        } />
                                </th>
                                <th>
                                    ruc
                                    <br />
                                    <input
                                        type="text"
                                        value={rucFilter}
                                        onChange={(e) =>
                                            changeKeyRucLabel(e.target.value)
                                        } />
                                </th>
                                <th>direccion</th>
                                <th>telefono</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientePaginado.map((prod) => (
                                <tr key={prod.idcliente}>
                                    <td> {prod.razon_social} </td>
                                    <td> {prod.ruc} </td>
                                    <td> {prod.direccion} </td>
                                    <td> {prod.telefono} </td>
                                    <td>
                                        <Link style={{ margin: `5px` }} to={`/editarcliente/${prod.idcliente}`} className='btn btn-info'><IoPencil /></Link>
                                        <Link style={{ margin: `5px` }} onClick={() => deleteCliente(prod.idcliente)} className='btn btn-danger'><IoTrashOutline /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginador pagina={registros} totalPagina={cliente.length} paginate={paginate} />
                    <div style={{ margin: `10px` }}>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/" className='btn btn-success mt-2 mb-2'> <IoHomeOutline /></Link>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/crearcliente" className='btn btn-primary mt-2 mb-2'> <IoAddSharp /></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListaCliente