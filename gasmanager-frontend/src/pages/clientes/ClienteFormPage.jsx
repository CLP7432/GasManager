import React from 'react';
import Layout from '../../components/common/Layout';
import ClienteForm from '../../components/clientes/ClienteForm';  // ← CAMBIAR a ClienteForm

const ClienteFormPage = () => {  // ← CAMBIAR el nombre del componente
    return (
        <Layout>
            <ClienteForm />  // ← CAMBIAR a ClienteForm
        </Layout>
    );
};

export default ClienteFormPage;