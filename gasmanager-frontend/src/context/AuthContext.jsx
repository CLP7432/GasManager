import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // Estado inicial desde localStorage
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return {
            token: token || null,
            user: user ? JSON.parse(user) : null,
            isAuthenticated: !!token
        };
    });

    const login = (userData) => {
        // userData debería contener: token, rol, idUsuario, correo, nombre
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify({
            token: userData.token,
            rol: userData.rol,
            idUsuario: userData.idUsuario,
            correo: userData.correo,
            nombre: userData.nombre || userData.correo
        }));

        setAuth({
            token: userData.token,
            user: {
                token: userData.token,
                rol: userData.rol,
                idUsuario: userData.idUsuario,
                correo: userData.correo,
                nombre: userData.nombre || userData.correo
            },
            isAuthenticated: true
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({
            token: null,
            user: null,
            isAuthenticated: false
        });
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            auth: auth.user,
            token: auth.token,
            isAuthenticated: auth.isAuthenticated,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};