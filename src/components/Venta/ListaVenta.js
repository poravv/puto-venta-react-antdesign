import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Paginador from '../Paginador/Paginador';
import { IoAddSharp, IoArrowForwardCircleOutline, IoTrashOutline, IoHomeOutline } from 'react-icons/io5';


const URI = 'http://186.158.152.141:3001/sisweb/api/venta';


const ListaVenta = ({ token,idusuario }) => {
    const [venta, setVenta] = useState([]);
    const [filtroVenta, setFiltroVenta] = useState([]);
    const [labelFilter, setLabelFilter] = useState([]);

    useEffect(() => {
        getVenta();
        // eslint-disable-next-line
    }, [])

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getVenta = async () => {
        const res = await axios.get(URI + `/getvenusu/${idusuario}`, config)
        setVenta(res.data.body);
        setFiltroVenta(res.data.body);
    }

    //FUNCION FLECHA DE FILTRO
    const changeKeyLabel = (value) => {
        setLabelFilter(value);
        setVenta(filtroVenta.filter((dt) =>
            (dt.producto.descripcion.indexOf(value) !== -1)
        ));
    }

    const deteleVentaCab = async (id) => {
        await axios.put(URI + "/inactiva/" + id, {}, config);
        getVenta();
    }

/**********************************************************/
/*************************Paginador************************/
/**********************************************************/
const [paginaInicial,setPaginaInicial] = useState(1);
const [registros] = useState(10);
const indiceSiguiente = paginaInicial * registros;
const indiceAnterior = indiceSiguiente - registros;
const ventaPaginado = venta.slice(indiceAnterior,indiceSiguiente);

//Cambio de pagina
const paginate = (pageNumber) => setPaginaInicial(pageNumber);

/**********************************************************/
/************************Fin Paginador*********************/
/**********************************************************/

    return (
        <div className='container'>
            <div style={{ margin:`20px` }}>
                <h2>Ventas</h2>
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
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventaPaginado.map((inv) => (
                                <tr key={inv.idventa}>
                                    <td> {inv.cliente.razon_social} </td>
                                    <td> {inv.fecha} </td>
                                    <td> {inv.total} </td>
                                    <td> {inv.estado} </td>
                                    <td>
                                        <Link style={{ margin: `5px` }} onClick={() => deteleVentaCab(inv.idventa)} className='btn btn-danger'><IoTrashOutline /></Link>
                                        <Link style={{ margin: `5px` }} to={`/detventa/${inv.idventa}`} className='btn btn-info'><IoArrowForwardCircleOutline /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginador pagina={registros} totalPagina={venta.length} paginate={paginate} />
                    <div style={{ margin: `10px` }}>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/" className='btn btn-success mt-2 mb-2'> <IoHomeOutline /></Link>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/crearventa" className='btn btn-primary mt-2 mb-2'> <IoAddSharp /></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ListaVenta