import { Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AlertModal({tipoMensaje,mensaje,show,handleClose}) {
    
    return (
        <>
            <Modal style={{ textAlign:`center` }} show={show} onHide={handleClose}>
            <div style={{ margin:`10px` }}>
            <Modal.Title >Alerta</Modal.Title>
            </div>
                <div style={{ margin:`10px` }}>
                <Alert  key={tipoMensaje} variant={tipoMensaje}>
                        {mensaje}
                    </Alert>
                </div>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AlertModal;