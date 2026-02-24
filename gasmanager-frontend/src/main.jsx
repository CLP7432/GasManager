import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext.jsx';

const rootElement = document.getElementById("root");
// Verifica que el elemento existe

if (!rootElement) {
    throw new Error('No se encontró el elemento con id "root"');
}

createRoot(document.getElementById('root')).render(
    <>
        <StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </StrictMode>
    </>
);
