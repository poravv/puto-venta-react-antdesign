import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { IoTrashOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import {Logout} from '../Utils/Logout';

const URI = 'http://186.158.152.141:3001/sisweb/api/detventa';


const ListaDetVenta = ({ token }) => {

    const { idventa } = useParams();
    const [detVenta, setDetVenta] = useState([]);

    useEffect(() => {
        getDetVenta();
        // eslint-disable-next-line
    }, [])

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getDetVenta = async () => {
        
        const res = await axios.get(URI+'/get/'+idventa, config)
        setDetVenta(res.data.body);
        
        /*En caso de que de error en el server direcciona a login*/
        if(res.data.error){
            Logout();
        }
    }

    const deleteDetVenta = async (id,cantidad) => {
        try {
            await axios.put(`${URI}/inactiva/${id}`,{estado:'IN',cantidad:cantidad,idventa:idventa}, config);
        } catch (error) {
            console.log(error)
        }
        getDetVenta();
    }

    return (
        <div className='container'>
            <div style={{ margin:`20px` }}>
                <h2>Detalle de venta</h2>
            </div>
            <div className='row'>
                <div className='col'>
                    <table className='table'>
                        <thead className='table-primary'>
                            <tr>
                                <th>Cantidad</th>
                                <th>Monto</th>
                                <th>Descuento</th>
                                <th>Tipo iva</th>
                                <th>Iva</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {detVenta.map((inv) => (
                                <tr key={inv.idinventario}>
                                    <td> {inv.cantidad} </td>
                                    <td> {inv.subtotal} </td>
                                    <td> {inv.descuento} </td>
                                    <td> {inv.tipo_iva} </td>
                                    <td> {inv.iva} </td>
                                    <td>
                                        <Link onClick={() => deleteDetVenta(inv.idventa,inv.cantidad)} className='btn btn-warning'><IoTrashOutline /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ margin: `10px` }}>
                        <Link style={{ margin: `10px`, width: `100px` }} to="/venta" className='btn btn-primary mt-2 mb-2'>Atras</Link>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ListaDetVenta