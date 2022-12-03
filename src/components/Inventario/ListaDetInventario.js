import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { IoTrashOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const URI = 'http://186.158.152.141:3001/sisweb/api/detinventario';


const ListaDetInventario = ({ token }) => {

    const { idinventario } = useParams();
    const [detInventario, setDetInventario] = useState([]);

    useEffect(() => {
        getDetInventario();
        // eslint-disable-next-line
    }, [])

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getDetInventario = async () => {
        
        //console.log('idinventario',idinventario);

        const res = await axios.get(URI+'/get/'+idinventario, config)
        setDetInventario(res.data.body);
        //console.log(res.data.body);
    }

    const deleteDetInventario = async (id,cantidad) => {
        try {
            await axios.put(`${URI}/inactiva/${id}`,{estado:'IN',cantidad:cantidad,idinventario:idinventario}, config);
        } catch (error) {
            console.log(error)
        }
        
        getDetInventario();
    }

    return (
        <div className='container'>
            <div style={{ margin:`20px` }}>
                <h2>Detalle de inventario</h2>
            </div>
            <div className='row'>
                <div className='col'>
                    <table className='table'>
                        <thead className='table-primary'>
                            <tr>
                                <th>id</th>
                                <th>Fecha</th>
                                <th>Fecha upd</th>
                                <th>Cantidad</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detInventario.map((inv) => (
                                <tr key={inv.iddet_inventario}>
                                    <td> {inv.iddet_inventario} </td>
                                    <td> {inv.fecha_insert} </td>
                                    <td> {inv.fecha_upd} </td>
                                    <td> {inv.cantidad} </td>
                                    <td>
                                        <Link onClick={() => deleteDetInventario(inv.iddet_inventario,inv.cantidad)} className='btn btn-warning'><IoTrashOutline /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ margin: `10px` }}>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/inventario" className='btn btn-primary mt-2 mb-2'>Atras</Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ListaDetInventario