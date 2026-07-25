import React from 'react';
import Layout from '../../components/common/Layout';
import ClienteList from '../../components/clientes/ClienteList';

const ClientesPage = () => {
    return (
        <Layout>
            <ClienteList />
        </Layout>
    );
};

export default ClientesPage;