import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Paginador from '../Paginador/Paginador';
import { IoAddSharp, IoTrashOutline, IoHomeOutline } from 'react-icons/io5';
import {Logout} from '../Utils/Logout';


const URI = 'http://186.158.152.141:3001/sisweb/api/producto_final'


const ListaProductoFinal = ({ token }) => {
    

    const [productoFinal, setProductoFinal] = useState([]);
    const [filtroProductoFinal, setFiltroProductoFinal] = useState([]);
    const [labelFilter, setLabelFilter] = useState([]);


    useEffect(() => {
        getProductoFinal();
        // eslint-disable-next-line
    }, [])

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getProductoFinal = async () => {
        const res = await axios.get(URI + '/get', config)
        setProductoFinal(res.data.body);
        setFiltroProductoFinal(res.data.body);
        
        /*En caso de que de error en el server direcciona a login*/
        if(res.data.error){
            Logout();
        }

    }

    const deleteProducto = async (id) => {
        await axios.put(`${URI}/inactiva/${id}`, {}, config);
        getProductoFinal();
    }
    //FUNCION FLECHA DE FILTRO
    const changeKeyLabel = (value) => {
        setLabelFilter(value);
        setProductoFinal(filtroProductoFinal.filter((dt) =>
            (dt.descripcion.indexOf(value) !== -1)
        ));
        //console.log(filtroProductoFinal);
    }
/**********************************************************/
/*************************Paginador************************/
/**********************************************************/
const [paginaInicial,setPaginaInicial] = useState(1);
const [registros] = useState(7);
const indiceSiguiente = paginaInicial * registros;
const indiceAnterior = indiceSiguiente - registros;
const productoFinalPaginado = productoFinal.slice(indiceAnterior,indiceSiguiente);

//Cambio de pagina
const paginate = (pageNumber) => setPaginaInicial(pageNumber);

/**********************************************************/
/************************Fin Paginador*********************/
/**********************************************************/

    return (
        <div className='container'>
            <div style={{ margin: `20px` }}>
                <h2>Producto</h2>
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
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productoFinalPaginado.map((prod) => (
                                <tr key={prod.idproducto_final}>
                                    <td> {prod.nombre} </td>
                                    <td> {new Intl.NumberFormat('es-PY').format(prod.costo)} </td>
                                    <td> {prod.estado} </td>
                                    <td>
                                        <Link onClick={() => deleteProducto(prod.idproducto_final)} className='btn btn-danger'><IoTrashOutline /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginador pagina={registros} totalPagina={productoFinal.length} paginate={paginate} />
                    <div style={{ margin: `10px` }}>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/" className='btn btn-success mt-2 mb-2'> <IoHomeOutline /></Link>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/crearprodfinal" className='btn btn-primary mt-2 mb-2'> <IoAddSharp /></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ListaProductoFinal