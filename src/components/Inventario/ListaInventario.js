import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Paginador from '../Paginador/Paginador';
import { IoAddSharp, IoArrowForwardCircleOutline, IoTrashOutline, IoHomeOutline } from 'react-icons/io5';
import {Logout} from '../Utils/Logout';


const URI = 'http://186.158.152.141:3001/sisweb/api/inventario'


const ListaInventario = ({ token,idsucursal }) => {


    const [inventario, setInventario] = useState([]);
    const [filtroInventario, setFiltroInventario] = useState([]);
    const [labelFilter, setLabelFilter] = useState([]);

    useEffect(() => {
        getInventario();
        // eslint-disable-next-line
    }, [])

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getInventario = async () => {
        const res = await axios.get(URI + `/getinvsuc/${idsucursal}`, config)
        setInventario(res.data.body);
        setFiltroInventario(res.data.body);

        /*En caso de que de error en el server direcciona a login*/
        if(res.data.error){
            Logout();
        }

    }

    //FUNCION FLECHA DE FILTRO
    const changeKeyLabel = (value) => {
        setLabelFilter(value);
        setInventario(filtroInventario.filter((dt) =>
            (dt.producto.descripcion.indexOf(value) !== -1)
        ));
    }

    const deteleInventarioCab = async (id) => {
        await axios.put(URI + "/inactiva/" + id, {}, config);
        getInventario();
    }

/**********************************************************/
/*************************Paginador************************/
/**********************************************************/
const [paginaInicial,setPaginaInicial] = useState(1);
const [registros] = useState(10);
const indiceSiguiente = paginaInicial * registros;
const indiceAnterior = indiceSiguiente - registros;
const inventarioPaginado = inventario.slice(indiceAnterior,indiceSiguiente);

//Cambio de pagina
const paginate = (pageNumber) => setPaginaInicial(pageNumber);

/**********************************************************/
/************************Fin Paginador*********************/
/**********************************************************/

    return (
        <div className='container'>
            <div style={{ margin:`20px` }}>
                <h2>Inventario</h2>
            </div>
            <div className='row'>
                <div className='col'>
                    <Table striped bordered hover>
                        <thead className='table-primary'>
                            <tr>
                                <th>
                                    Producto
                                    <br />
                                    <input
                                        type="text"
                                        value={labelFilter}
                                        onChange={(e) =>
                                            changeKeyLabel(e.target.value)
                                        } />
                                </th>
                                <th>Cantidad</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventarioPaginado.map((inv) => (
                                <tr key={inv.idinventario}>
                                    <td> {inv.producto.descripcion} </td>
                                    <td> {inv.cantidad_total - inv.cantidad_ven} </td>
                                    <td>
                                        <Link style={{ margin: `5px` }} onClick={() => deteleInventarioCab(inv.idinventario)} className='btn btn-danger'><IoTrashOutline /></Link>
                                        <Link style={{ margin: `5px` }} to={`/detinv/${inv.idinventario}`} className='btn btn-info'><IoArrowForwardCircleOutline /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginador pagina={registros} totalPagina={inventario.length} paginate={paginate} />
                    <div style={{ margin: `10px` }}>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/" className='btn btn-success mt-2 mb-2'> <IoHomeOutline /></Link>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/crearinv" className='btn btn-primary mt-2 mb-2'> <IoAddSharp /></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ListaInventario