import axios from 'axios'
import { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Table, Select } from 'antd';
import { Spin } from 'antd';
import Buscador from '../Buscador/Buscador';
import UploadFile from '../Utils/Upload';
import { Buffer } from 'buffer'

const { Option } = Select;
const URI = 'http://186.158.152.141:3001/sisweb/api/proveedor/';

function TableModel({ token, form, data, mergedColumns, keyExtraido }) {

  //Celdas editables
  const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    //console.log('edit',record);

    const [previewImage, setPreviewImage] = useState('');
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
      getProveedor();
      // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    };

    const getProveedor = async () => {
      const res = await axios.get(`${URI}/get`, config);
      setProveedores(res.data.body);
    }

    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    switch (dataIndex) {
      case 'estado':
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  <Select allowClear > <Option value="AC">Activo</Option> <Option value="IN">Inactivo</Option> </Select>
                </Form.Item>
              ) : (children)
            }
          </td>);
      //break;
      case 'idproveedor':
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador label={'razon_social'} value={'idproveedor'} data={proveedores} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      case 'img':
        //console.log(dataIndex);
        return (
          <td {...restProps}>
            {
              //
              editing ?
                <Form.Item name={dataIndex} style={{ margin: 0, }}  >
                  <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} >
                    
                      { //Aqui la logica de si actualiza o no las imagenes del formulario
                      (previewImage!=='' && previewImage !=null) ? 
                          record.img=previewImage : 
                          record.img ? 
                          record.img = Buffer.from(record.img).toString('ascii'):
                          null}
                    
                  </UploadFile>
                </Form.Item>
                : (children)
            }
          </td>);
      //break;
      default:
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  {inputNode}
                </Form.Item>
              ) : (children)
            }
          </td>);
    }
  };

  return (
    <>
      {
        data ? <Form form={form} component={false}>
          <Table
            rowKey={keyExtraido}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            scroll={{
              x: 'calc(700px + 50%)',
              y: 400,
            }}

          //pagination={{onChange: setCantidadRow,pageSize: 50,}}
          />
        </Form> :
          <section style={{ textAlign: `center`, margin: `10px` }}>
            <Spin />
          </section>
      }
    </>
  );
};
export default TableModel;