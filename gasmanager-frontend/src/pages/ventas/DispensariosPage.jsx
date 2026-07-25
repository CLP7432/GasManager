import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import DispensariosLista from '../../components/ventas/DispensariosLista';
import DispensarioForm from '../../components/ventas/DispensarioForm';

const DispensariosPage = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DispensariosLista />} />
                <Route path="/nuevo" element={<DispensarioForm />} />
                <Route path="/editar/:id" element={<DispensarioForm />} />
            </Routes>
        </Layout>
    );
};

export default DispensariosPage;