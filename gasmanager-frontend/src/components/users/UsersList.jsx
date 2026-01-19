import React from "react";
import api from '../../services/api'
import {useEffect, useState} from "react";
import {CreateUser} from "./CreateUser.jsx";


export function UserList() {

    const[users, setUsers] = useState([]);

    const loadUsers = async () =>{
        try{
            const res = await api.get("/usuarios");
            setUsers(res.data);
        }catch (err){
            console.error("Error al listar usuarios", err);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreated = () => {
        //Se recarga la lista despues de crear
        loadUsers();
    };

    useEffect(() => {
        api.get('/usuarios')
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error al listar usuarios", err));
    }, []);

    return(
        <>
            <div className="container mt-4">
                <h2 className="mb-3"> Usuarios</h2>

                <CreateUser onCreated={handleCreated}/>

                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Usuarios</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="3">No hay usuarios registrados</td>
                        </tr>
                    ):(
                      users.map(u => (
                        <tr key={u.idUsuario}>
                            <td>{u.idUsuario}</td>
                            <td>{u.nombre}</td>
                            <td>{u.correo}</td>
                        </tr>
                      ))
                    )}
                    </tbody>
                </table>
            </div>
        </>
    )
}