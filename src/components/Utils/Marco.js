import Table from 'react-bootstrap/Table';
import '../../App.css';

const Marco = ({ titulo, cuerpo, pie }) => {

    return (
        <div className='container'>
            <Table striped bordered hover variant="dark">
                <thead >
                    <tr>
                        <td>
                            <div className='titulo'>
                                <h3>{titulo}</h3>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {cuerpo}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            {pie}
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )

}

export default Marco