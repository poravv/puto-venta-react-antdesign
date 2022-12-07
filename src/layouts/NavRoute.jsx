import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
//Importamos componentes creados
import Inicio from '../components/Inicio';
import NuevoArticulo from '../components/Articulos/NuevoArticulo';
import ListaArticulos from '../components/Articulos/ListaArticulos';
import ListaProveedor from '../components/Proveedor/ListaProveedor';
import ListaInventario from '../components/Inventario/ListaInventario';
import ListaDetInventario from '../components/Inventario/ListaDetInventario';
import CrearInventario from '../components/Inventario/CrearInventario';
import ListaProductoFinal from '../components/ProductoFinal/ListaProductoFinal';
import NuevoProductoFinal from '../components/ProductoFinal/NuevoProductoFinal';
import ListaCliente from '../components/Clientes1/ListaClientes';
import CrearCliente from '../components/Clientes1/CrearClientes';
import EditarCliente from '../components/Clientes1/EditarClientes';
import ListaVenta from '../components/Venta/ListaVenta';
import ListaDetVenta from '../components/Venta/ListaDetVenta';
import CrearVenta from '../components/Venta/CrearVenta';
import AppBar from './AppBar';
import TableFormat from '../components/TableModel/Table';
import NuevoProveedor from '../components/Proveedor/NuevoProveedor';

function NavRoute({ usuario }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppBar usuario={usuario.body} />} >
            <Route index element={<Inicio  token={usuario.token} usuario={usuario.body.nick}/> }/>
            <Route path='/inicio' element={<Inicio   token={usuario.token} usuario={usuario.body.nick}/>} />
            {
              usuario.body.nivel === 1 ?
                <>
                  #Proveedor
                  <Route path='/proveedor' element={<ListaProveedor token={usuario.token} />} />
                  <Route path='/crearprov' element={<NuevoProveedor idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  #Producto
                  <Route path='/articulo' element={<ListaArticulos token={usuario.token} />} />
                  <Route path='/creararticulo' element={<NuevoArticulo idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  #Producto final
                  <Route path='/producto' element={<ListaProductoFinal token={usuario.token} />} />
                  <Route path='/crearproducto' element={<NuevoProductoFinal token={usuario.token} />} />

                  <Route path='*' element={<Navigate replace to='/' />} />
                  

                </>
                : null
            }
            #Inventario
            <Route path='/inventario' element={<ListaInventario token={usuario.token} idsucursal={usuario.body.idsucursal} />} />
            <Route path='/detinv/:idinventario' element={<ListaDetInventario token={usuario.token} />} />
            <Route path='/crearinv' element={<CrearInventario token={usuario.token} idsucursal={usuario.body.idsucursal} />} />

            #Cliente
            <Route path='/cliente' element={<ListaCliente token={usuario.token} />} />
            <Route path='/crearcliente' element={<CrearCliente token={usuario.token} />} />
            <Route path='/editarcliente/:id' element={<EditarCliente idusuario={usuario.body.idusuario} token={usuario.token} />} />
            <Route path='*' element={<Navigate replace to='/' />} />
            #Venta
            <Route path='/venta' element={<ListaVenta token={usuario.token} idusuario={usuario.body.idusuario} />} />
            <Route path='/detventa/:idventa' element={<ListaDetVenta token={usuario.token} />} />
            <Route path='/crearventa' element={<CrearVenta token={usuario.token} idusuario={usuario.body.idusuario} idsucursal={usuario.body.idsucursal} />} />
            #Table model
            <Route path='/tablemodel' element={<TableFormat title={'Formato'}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default NavRoute;
