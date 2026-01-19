import {useState} from "react";


export const ejemplo = () =>{

    const [inicio, setInicio] = useState("");

    return (

       <>
        <div>
            <h1>Hola mundo {inicio}</h1>
        </div>


       </>


    )
}