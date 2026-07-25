import React from 'react';
import Layout from '../../components/common/Layout';
import ConfiguracionLealtad from '../../components/lealtad/ConfiguracionLealtad';

const ConfiguracionLealtadPage = () => {
    return (
        <Layout>
            <div className="container-fluid py-4">
                <ConfiguracionLealtad />
            </div>
        </Layout>
    );
};

export default ConfiguracionLealtadPage;
