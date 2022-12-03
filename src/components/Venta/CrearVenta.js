import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../CSS/Cuerpo.css'
import '../../CSS/Buscador.css';
import { IoAddSharp, IoTrashOutline, IoCloseCircleOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';
import { Col, Container, Row } from "react-bootstrap";
import BuscadorDato from "../Buscador/Buscador1";
import AlertModal from '../Utils/AlertModal';

const URI = 'http://186.158.152.141:3001/sisweb/api/venta/';
const URIINVDET = 'http://186.158.152.141:3001/sisweb/api/detventa/';
const URIPROD = 'http://186.158.152.141:3001/sisweb/api/producto_final/';
const URICLI = 'http://186.158.152.141:3001/sisweb/api/cliente/';

const CrearVenta = ({ token, idusuario,idsucursal }) => {

  const fechaActual = new Date();
  const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();

  const navigate = useNavigate();
  const [tblventatmp, setTblVentaTmp] = useState([]);
  const [cantidad, setCantidad] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalIva, setTotalIva] = useState(0);
  const [descuento, setDescuento] = useState(0);

  //Llamada a alerta y su mensaje
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mensaje, setMensaje] = useState(null);

  //Buscador
  const [clienteSelected, setClienteSelected] = useState(null);
  const [valueCliente, setValueCliente] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [valueProd, setValueProd] = useState("");
  

  const config = {
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  };

  


  const verificaproceso = async () => {
    return await axios.post(URI + `verificaproceso/${idusuario}-inventario`, {}, config);
  }


  useEffect(() => {
    verificaproceso();
    // eslint-disable-next-line
  }, [])

  //procedimiento para actualizar
  const gestionGuardado = async (e) => {
    e.preventDefault();

    /*
    1- Armar un loop para recorrer cada registro -ok
    2- Buscar si existe un registro de la cabecera por el producto_final
    3-Insertar cabecera si no existe y actualizar si es que existe
    */

    try {
      guardaCab(
        {
          idusuario: idusuario,
          idcliente: clienteSelected.idcliente,
          estado: 'AC',
          fecha: strFecha,
          iva_total: totalIva,
          total: total,
          costo_envio: 0,
          nro_comprobante:0
        }
      ).then((cabecera) => {
        try {
          console.log('Entra en guarda detalle')
          //Guardado del detalle
          tblventatmp.map((venta) => {
            guardaDetalle({
              cantidad: venta.cantidad,
              idproducto_final: venta.producto_final.idproducto_final,
              estado: venta.producto_final.estado,
              descuento: venta.descuento,
              idventa: cabecera.data.body.idventa,
              subtotal: venta.producto_final.costo * venta.cantidad,
            });
            operacionVenta(venta.producto_final.idproducto_final);
            return null;
          });
          
        } catch (error) {
          console.log(e);
          setMensaje('Error de guardado detalle.')
          setTimeout(() => {
            setMensaje(null)
          }, 8000);
          handleShow();
          return null;
        }
        navigate('/venta');
      });
    } catch (e) {
      console.log(e);
      setMensaje('Error de guardado cabecera.')
      setTimeout(() => {
        setMensaje(null)
      }, 8000);
      handleShow();
      return null;
    }
  }

  const guardaCab = async (valores) => {
    //Guardado de cabecera
    return await axios.post(URI + "post/", valores, config);
  }

  const operacionVenta = async (idproducto_final) => {
      //console.log(idproducto_final,'-',idusuario,'-',0);
      return await axios.post(URI + `operacionventa/${idproducto_final}-procesado-${idusuario}-0`, {}, config);
  }

  const guardaDetalle = async (valores) => {
    await axios.post(URIINVDET + "post/", valores, config);
  }

  const agregarLista = async (e) => {
    e.preventDefault();

    //Validacion de existencia del producto dentro de la lista 
    const validExist = tblventatmp.filter((inv) => inv.idproducto_final === productoSeleccionado.idproducto_final);

    if (productoSeleccionado !== null) {
      if (cantidad !== 0 && cantidad !== null && cantidad !== '') {
        if (validExist.length === 0) {

          //La idea es hacer que en el server se haga el calculo de si existe o no el stock por el producto
          console.log(productoSeleccionado.obs);
          if (productoSeleccionado.obs !== 'STOCK') {
            setMensaje('No hay stock para este producto')
            setTimeout(() => {
              setMensaje(null)
            }, 8000);
            handleShow();
            return ;
          } 

            //console.log('Cantidad posible ', productoSeleccionado.cant_prod_posible);
            //console.log('Cantidad requerida ', cantidad);

            if (parseInt(cantidad) <= parseInt(productoSeleccionado.cant_prod_posible)) {

              try {
                await axios.post(URI + `operacionventa/${productoSeleccionado.idproducto_final}-venta-${idusuario}-${cantidad}`, {}, config);
              } catch (error) {
                console.log('Error: ', error);
              }

              //console.log(productoSeleccionado);


              tblventatmp.push({
                idproducto_final: productoSeleccionado.idproducto_final,
                producto_final: productoSeleccionado,
                cantidad: cantidad,
                descuento: descuento
              });

              setTotal(total + (cantidad * productoSeleccionado.costo) - descuento);
              setTotalIva(totalIva + (cantidad * productoSeleccionado.monto_iva));

            } else {
              setMensaje('No hay stock para la cantidad requerida')
              setTimeout(() => {
                setMensaje(null)
              }, 8000);
              handleShow();
            }

          setProductoSeleccionado(null);
          setValueProd("")

        } else {
          setMensaje('El producto ya existe en la lista')
          setTimeout(() => {
            setMensaje(null)
          }, 8000);
          handleShow();
        }
      } else {
        setMensaje('Cargue la cantidad de producto')
        setTimeout(() => {
          setMensaje(null)
        }, 8000);
        handleShow();
      }
    } else {
      setMensaje('Selecciona un producto')
      setTimeout(() => {
        setMensaje(null)
      }, 8000);
      handleShow();
    }

  }




  const extraerRegistro = async (id, costo, monto_iva) => {

    //console.log('Entra en delete', id);

    const updtblVenta = tblventatmp.filter(inv => inv.idproducto_final !== id);
    setTblVentaTmp(updtblVenta);

    try {
      await axios.post(URI + `operacionventa/${id}-retorno-${idusuario}-0`, {}, config);
    } catch (error) {
      console.log('Error: ', error);
    }

    setTotal(total - costo);
    setTotalIva(totalIva - monto_iva);

  };

  const limpiarCliente = (e) => {
    e.preventDefault();
    setClienteSelected(null);
    setValueCliente("");
  }

  const btnCancelar = (e) => {
    e.preventDefault();
    navigate('/venta');
  }

  return (
    <div >
      <div style={{ alignItems: `center`, justifyContent: `center`, display: `flex` }}>
        {mensaje ? <AlertModal tipoMensaje={'danger'} mensaje={mensaje} show={show} handleClose={handleClose} /> : null}
      </div>
      <div style={{ margin: `20px` }}>
        <h2>Registrar venta</h2>
      </div>
      {/* Contenedor de clientes */}
      <Container style={{ border: `1px solid gray  `, borderRadius: `5px` }} >
        <h5 style={{ margin: `10px` }}>Cliente</h5>
        <form name="formAdd" onSubmit={limpiarCliente}  >
          <Row style={{ alignItems: `center`, justifyContent: `center`, margin: `10px` }}>
            <Col>
              <BuscadorDato setDatoSeleccionado={setClienteSelected} uri={URICLI + "get/"} config={config} campo={'Cliente'} setValue={setValueCliente} value={valueCliente}/>
            </Col>
            <Col>
              <input style={{ minWidth: `430px` }} value={clienteSelected == null ? "Cliente" : clienteSelected.razon_social} disabled={true} className="form-control" />
            </Col>
            <Col xs={1}>
              <button type="submit" className="btn btn-warning"><IoCloseCircleOutline /></button>
            </Col>
          </Row>
        </form>
      </Container>
      
      <br/>
      
      {/* Contenedor de productos */}
      <Container style={{ border: `1px solid gray  `, borderRadius: `5px` }} >
        <h5 style={{ margin: `10px` }}>Productos</h5>
        <form name="formAdd" onSubmit={agregarLista}  >
          <Row style={{ alignItems: `center`, justifyContent: `center`, margin: `10px` }}>
            <Col>
              <BuscadorDato setDatoSeleccionado={setProductoSeleccionado} uri={URIPROD + `productoventa/${idsucursal}`} config={config} campo={'Producto'} setValue={setValueProd} value={valueProd} />
            </Col>
            <Col xs={1} >
              <label className="form-label">Cantidad</label>
            </Col>
            <Col>
              <input value={cantidad} onChange={(e) => setCantidad(e.target.value)} type="number" className="form-control" />
            </Col>
            <Col xs={1} >
              <label className="form-label">Descuento</label>
            </Col>
            <Col>
              <input value={descuento} onChange={(e) => setDescuento(e.target.value)} type="number" className="form-control" />
            </Col>
            <Col xs={1}>
              <button type="submit" className="btn btn-primary"><IoAddSharp /></button>
            </Col>
          </Row>
        </form>
      </Container>
      <br/>
      <Table striped bordered hover>
        <thead className='table-primary'>
          <tr>
            <th>Producto</th>
            <th>Costo</th>
            <th>Cantidad</th>
            <th>Descuento</th>
            <th>Iva</th>
            <th>Monto Iva</th>
            <th>Subtotal iva</th>
            <th>Subtotal</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {tblventatmp.length !== 0 ? tblventatmp.map((inv) => (
            <tr key={inv.idproducto_final}>
              <td> {inv.producto_final.nombre} </td>
              <td> {inv.producto_final.costo} </td>
              <td> {inv.cantidad} </td>
              <td> {inv.descuento} </td>
              <td> {inv.producto_final.tipo_iva + '%'} </td>
              <td> {inv.producto_final.monto_iva} </td>
              <td> {inv.producto_final.monto_iva * inv.cantidad} </td>
              <td> {inv.producto_final.costo * inv.cantidad} </td>
              <td>
                <button onClick={() => extraerRegistro(inv.idproducto_final, (inv.producto_final.costo - descuento), inv.producto_final.monto_iva)} className='btn btn-danger'><IoTrashOutline /></button>
              </td>
            </tr>
          )) : null
          }
        </tbody>
        <tfoot >
          <tr>
            <th>Total</th>
            <th style={{ textAlign: `start` }} colSpan={7}>
              <b>{total}</b>
            </th>
          </tr>
          <tr>
            <th>Total iva</th>
            <th style={{ textAlign: `start` }} colSpan={7}>
              <b>{totalIva}</b>
            </th>
          </tr>
        </tfoot>
      </Table>
      <form onSubmit={gestionGuardado}>
        <div style={{ margin: `30px` }}>
          <button disabled={tblventatmp.length === 0 ? true : false} style={{ margin: `10px` }} type="submit" className="btn btn-primary">Procesar</button>
          <button style={{ margin: `10px` }} onClick={btnCancelar} className="btn btn-primary">Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default CrearVenta;