
import './App.css';
import { useEffect, useState } from 'react';
import ConfigBrows from './layouts/NavRoute'
import LoginForm from './components/LoginForm';
import { theme } from 'antd';
import { ConfigProvider } from 'antd';
import { FloatButton } from 'antd';
import { IoMoonOutline,IoColorWandSharp,IoSunnyOutline } from "react-icons/io5";

function App() {

  const [userApp, setUserApp] = useState(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const { darkAlgorithm,defaultAlgorithm } = theme;
  
  const dark = {  algorithm: [darkAlgorithm] }
  const normal = { token: { defaultAlgorithm }};

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedSiswebUser');
    if (loggedUserJSON) {
      const userJson = JSON.parse(loggedUserJSON);
      setUserApp(userJson);
      //console.log("Suc: ",userJson.body.idsucursal);
    }
  }, []);

  return (
    <>
      <ConfigProvider
        theme={temaSeleccionado}
        >
          
        {
          userApp ? <ConfigBrows usuario={userApp} /> : <LoginForm />
        }
      </ConfigProvider>
      <FloatButton.Group icon={< IoColorWandSharp />} 
          type="primary" 
          trigger="click"
          >
        <FloatButton style={{color:`red`}} onClick={() => setTemaSeleccionado(normal)} icon={<IoSunnyOutline />} />

        <FloatButton onClick={() => setTemaSeleccionado(dark)} icon={<IoMoonOutline />} />

      </FloatButton.Group>
    </>
  );
}
export default App;
