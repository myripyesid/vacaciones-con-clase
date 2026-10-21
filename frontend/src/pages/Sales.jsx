import React, {use, useEffect, useState} from "react";
import SalesHeader from "../components/advisor/SalesHeader";

export default function Sales(){
const [leads, setLeads] = useState([]);
const [cargando, setCargando] = useState(true);

useEffect(() => {
    fetch("http://127.0.0.1:8000/api/asesor/leads")
    .then(response => response.json())
    .then(data => {
        setLeads(data);
        setLoading(false);
    })
    .catch(error => {
        console.error("Error: ", error)
        setLoading(false)
    })
}, []);

if(loading){
    return <p>Cargando...</p>
}

return(
    <div>
        <SalesHeader leads={leads}/>
    </div>
)
}