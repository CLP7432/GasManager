import React from 'react';
import Layout from '../../components/common/Layout';
import VentasLista from '../../components/ventas/VentasLista';

const VentasPage = () => {
    return (
        <Layout>
            <VentasLista />
        </Layout>
    );
};

export default VentasPage;