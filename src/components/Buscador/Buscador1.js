import Autosuggest from 'react-autosuggest';
import '../../CSS/Buscador.css'
import axios from "axios";
import { useEffect, useState } from "react";
import '../../CSS/Cuerpo.css'
import '../../CSS/Buscador.css';


export default function BuscadorDato({ uri,config,setDatoSeleccionado,campo,setValue,value }) {  

  const [dato, setDato] = useState([]);
  const [filtroDato, setFiltroDato] = useState([]);
  

  const getDatoBD = async () => {
    const res = await axios.get(uri, config);
    setDato(res.data.body);
    setFiltroDato(res.data.body);
    //console.log(res.data.body);
  }

  useEffect(() => {
    getDatoBD();
    // eslint-disable-next-line
  }, [])

  const onSuggestionsFetchRequested = ({ value }) => {
    setDato(filtrarDato(value));
  }

  const filtrarDato = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // eslint-disable-next-line 
    var filtrado = filtroDato.filter((dato) => {
      var textoCompleto = (dato.nombre??dato.descripcion??dato.razon_social??"") + " - " + new Intl.NumberFormat('es-PY').format(dato.costo??dato.monto??0) + " - " + dato.estado??"";

      if (textoCompleto.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(inputValue)) {
        return dato;
      }
    });

    return inputLength === 0 ? [] : filtrado;
  }

  const onSuggestionsClearRequested = () => {
    setDato([]);
  }

  const getSuggestionValue = (suggestion) => {
    return `${(suggestion.nombre??suggestion.descripcion??suggestion.razon_social??"")} - ${new Intl.NumberFormat('es-PY').format(suggestion.costo??suggestion.monto??0)} - ${suggestion.estado??""}`;
  }

  const renderSuggestion = (suggestion) => (
    <div className='sugerencia' onClick={() => seleccionarDato(suggestion)}>
      {`${(suggestion.nombre??suggestion.descripcion??suggestion.razon_social??"")} - ${new Intl.NumberFormat('es-PY').format(suggestion.costo??suggestion.monto??0)} - ${suggestion.estado??""}`}
    </div>
  )

  const seleccionarDato = (dato) => {
    setDatoSeleccionado(dato);
  }

  const onChange = (e, { newValue }) => {
    setValue(newValue);
  }

  const inputProps = {
    placeholder: "Buscar "+campo,
    value,
    onChange
  };

  const eventEnter = (e) => {
    // eslint-disable-next-line 
    if (e.key == "Enter") {
      var split = e.target.value.split('-');
      var dato = {
        dato: split[0].trim(),
      };
      seleccionarDato(dato);
    }
  }

  return (
    <Autosuggest
      suggestions={dato} onSuggestionsFetchRequested={onSuggestionsFetchRequested} onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue} renderSuggestion={renderSuggestion} inputProps={inputProps} onSuggestionSelected={eventEnter} />
  );

}
