import React from 'react';
import Layout from '../../components/common/Layout';
import InventarioCombustibleList from '../../components/inventarios/InventarioCombustibleList';

const InventarioCombustiblePage = () => {
    return (
        <Layout>
            <InventarioCombustibleList />
        </Layout>
    );
};

export default InventarioCombustiblePage;