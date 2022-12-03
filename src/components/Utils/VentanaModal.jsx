import React from 'react';
import { Button, Modal } from 'antd';

const VentanaModal = ({ title, open, handleOk, handleCancel, loading, Cuerpo }) => {

  return (
    <>
      <Modal
        open={open}
        title={title}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Submit
          </Button>
        ]} >

        <div>
          <Cuerpo />
        </div>

      </Modal>
    </>
  );
};
export default VentanaModal;