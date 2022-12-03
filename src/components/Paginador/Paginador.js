

const Paginador = ({pagina,totalPagina,paginate}) => {

    const pageNumbers =[];

    for(let i =1 ; i <= Math.ceil(totalPagina/pagina); i++){
        pageNumbers.push(i);
    }
    
    return (
        <div style={{ alignItems:`center`,justifyContent:`center`, display:`flex` }}>
        <ul style={{ margin:`0px` }} className="pagination">
            {pageNumbers.map(number => (
                <li key={number} className='page-item'>
                    <p onClick={() => paginate(number)} className="page-link">
                        {number}
                    </p>
                </li>
            ))}
        </ul>
        </div>
    )
}

export default Paginador;