import React from 'react';
import Layout from '../../components/common/Layout';
import CombustibleList from '../../components/inventarios/CombustibleList';

const CombustiblesPage = () => {
    return (
        <Layout>
            <CombustibleList />
        </Layout>
    );
};

export default CombustiblesPage;