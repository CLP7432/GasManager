import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import CreditoList from '../../components/clientes/CreditoList';

const CreditosPorClientePage = () => {
    const { clienteId } = useParams();

    return (
        <Layout>
            <CreditoList clienteId={clienteId} />
        </Layout>
    );
};

export default CreditosPorClientePage;