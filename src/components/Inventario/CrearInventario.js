import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/Cuerpo.css'
import BuscadorDato from "../Buscador/Buscador1";
import '../../CSS/Buscador.css';
import { IoAddSharp, IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';

const URI = 'http://186.158.152.141:3001/sisweb/api/inventario/';
const URIINVDET = 'http://186.158.152.141:3001/sisweb/api/detinventario/';
const URIPROD = 'http://186.158.152.141:3001/sisweb/api/producto/';



const CrearInventario = ({ token, idsucursal }) => {
  
  const fechaActual = new Date();

  const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth()+1) + "-" + fechaActual.getDate();
  
  //console.log(strFecha);

  const navigate = useNavigate();
  const [tblinventariotmp, setTblInventarioTmp] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [mensaje, setMensaje] = useState(null);

  //Buscador 
  const [productoSeleccionado, setproductoSeleccionado] = useState(null);
  const [valueProd, setvalueProd] = useState("");

  const config = {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  };

  
  const getProductoId = async (idinventario) => {
    return await axios.get(`${URI}getidproducto/${idinventario}-${idsucursal}`, config);
  }
  

  //procedimiento para actualizar
  const gestionGuardado = async (e) => {
    e.preventDefault();

    /*
    1- Armar un loop para recorrer cada registro -ok
    2- Buscar si existe un registro de la cabecera por el producto
    3-Insertar cabecera si no existe y actualizar si es que existe
    */

    tblinventariotmp.map((inventario) => {
      getProductoId(inventario.idproducto).then((value) => {
      try {
        actualizaCab(value.data.body[0].idinventario, {
          idinventario: value.data.body[0].idinventario,
          estado: value.data.body[0].estado,
          //idproducto: value.data.body[0].idproducto,
          //idsucursal: idsucursal,
          cantidad_total: (parseInt(value.data.body[0].cantidad_total) + parseInt(inventario.cantidad)),
          //cantidad_ven: value.data.body[0].cantidad_ven,
        }).then((cabecera) => {
          //console.log('El id es: ', cabecera);
          //Guardado del detalle
          guardaDetalle({
            cantidad: inventario.cantidad,
            estado: 'AC',
            idinventario: value.data.body[0].idinventario,
            fecha_insert: strFecha,
            fecha_upd: strFecha,
          });
        });
      } catch (error) {
        console.log(error)
      }
      
  });

//Comentado por motivo de que el inventario ya se inserta al insertar el articulo, luego solo se actualiza
      /*
      getProductoId(inventario.idproducto).then((value) => {

        //console.log(value.data.body.length);

        if (value.data.body.length !== 0) {
          //console.log("Actualiza cabecera",value.data.body[0].idinventario);
          try {
            actualizaCab(value.data.body[0].idinventario, {
              idinventario: value.data.body[0].idinventario,
              estado: value.data.body[0].estado,
              idproducto: value.data.body[0].idproducto,
              idsucursal: idsucursal,
              cantidad_total: (parseInt(value.data.body[0].cantidad_total) + parseInt(inventario.cantidad)),
              cantidad_ven: value.data.body[0].cantidad_ven,
            }).then((cabecera) => {
              console.log('El id es: ', cabecera);

              //Guardado del detalle
              guardaDetalle({
                cantidad: inventario.cantidad,
                estado: 'AC',
                idinventario: value.data.body[0].idinventario,
                fecha_insert: strFecha,
                fecha_upd: strFecha,
              });

            });
          } catch (error) {
            console.log(error)
          }

        } else {
          console.log("Guarda cabecera");
          try {
            guardaCab(
              {
                idsucursal: idsucursal,
                estado: 'AC',
                cantidad_total: (inventario.cantidad),
                cantidad_ven: 0,
                idproducto: inventario.idproducto
              }
            ).then((cabecera) => {
              console.log('El id es: ', cabecera);

              //Guardado del detalle
              guardaDetalle({
                cantidad: inventario.cantidad,
                estado: 'AC',
                idinventario: cabecera.data.body.idinventario,
                fecha_insert: strFecha,
                fecha_upd: strFecha,
              });

            });
          } catch (e) {
            console.log(e);
          }
        }
      });
      */
      return true;
    });
    
  }

  /*
  const guardaCab = async (valores) => {
    //console.log("Entra en guardaCab");
    //Guardado de cabecera
    return await axios.post(URI + "post/", valores, config);
    //console.log(invCabecera);
  }
  */

  const actualizaCab = async (idinventario, valores) => {
    //console.log("Entra en actualizaCab");
    return await axios.put(URI + "put/" + idinventario, valores, config);
    //console.log(invCabecera);
  }

  const guardaDetalle = async (valores) => {
    await axios.post(URIINVDET + "post/", valores, config);
    navigate('/inventario');
  }

  const agregarLista = async (e) => {
    e.preventDefault();

    const validExist = tblinventariotmp.filter((inv) => inv.idproducto === productoSeleccionado.idproducto);
    //console.log(productoSeleccionado);

    if (productoSeleccionado !== null) {
      if (cantidad !== 0 && cantidad !== null && cantidad !== '') {
        if (validExist.length === 0) {
          tblinventariotmp.push({
            idproducto: productoSeleccionado.idproducto,
            producto: productoSeleccionado,
            cantidad: cantidad
          });
          setproductoSeleccionado(null);
          setCantidad(0);
          setvalueProd("");

        } else {
          setMensaje('El producto ya existe en la lista')
          setTimeout(() => {
            setMensaje(null)
          }, 5000);
        }
      } else {
        setMensaje('Cargue la cantidad')
        setTimeout(() => {
          setMensaje(null)
        }, 5000);
      }
    } else {
      setMensaje('Selecciona un producto')
      setTimeout(() => {
        setMensaje(null)
      }, 5000);
    }

  }


  const extraerRegistro = (id) => {
    //console.log('Entra en delete', id);
    const updtblInventario = tblinventariotmp.filter(inv => inv.idproducto !== id);
    setTblInventarioTmp(updtblInventario);
  };

  const btnCancelar = (e) => {
    e.preventDefault();
    navigate('/inventario');
  }

  return (
    <div >
      <div style={{ margin:`20px` }}>
                <h2>Cargar inventario</h2>
            </div>
      <form name="formAdd" onSubmit={agregarLista} >
        <div style={{ backgroundColor: `white`, display: `flex`, alignItems: `center`, justifyContent: `center`, flexWrap: `wrap` }}>
          <label style={{ margin: `10px` }} className="form-label">Producto</label>
          <div style={{ margin: `10px` }} >
          <BuscadorDato setDatoSeleccionado={setproductoSeleccionado} uri={`${URIPROD}get/`} config={config} campo={'Producto'} setValue={setvalueProd} value={valueProd}/>
          </div>
          <label style={{ margin: `10px` }} className="form-label">Cantidad</label>
          <div style={{ margin: `10px` }}>
            <input value={cantidad} onChange={(e) => setCantidad(e.target.value)} type="number" className="form-control" />
          </div>
          <button style={{ margin: `10px` }} type="submit" className="btn btn-primary"><IoAddSharp /></button>
        </div>
      </form>
      <label style={{ color: `red`, margin: `10px` }} >{mensaje}</label>
      <Table striped bordered hover>
        <thead className='table-primary'>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {tblinventariotmp.length !== 0 ? tblinventariotmp.map((inv) => (
            <tr key={inv.idproducto}>
              <td> {inv.producto.descripcion} </td>
              <td> {inv.cantidad} </td>
              <td>
                <button onClick={() => extraerRegistro(inv.idproducto)} className='btn btn-danger'><IoTrashOutline /></button>
              </td>
            </tr>
          )) : null
          }
        </tbody>
      </Table>
      <form onSubmit={gestionGuardado}>
        <div style={{ margin: `30px` }}>
          <button style={{ margin: `10px` }} type="submit" className="btn btn-primary">Guardar</button>
          <button style={{ margin: `10px` }} onClick={btnCancelar} className="btn btn-primary">Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default CrearInventario