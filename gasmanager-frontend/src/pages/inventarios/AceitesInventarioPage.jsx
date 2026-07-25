import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import AceitesInventarioDashboard from '../../components/inventarios/AceitesInventarioDashboard';
import AceitesBodegaList from '../../components/inventarios/AceitesBodegaList';
import AceitesDispensarioList from '../../components/inventarios/AceitesDispensarioList';
import CompraAceiteForm from '../../components/inventarios/CompraAceiteForm';
import SurtirAceiteForm from '../../components/inventarios/SurtirAceiteForm';
import AceitesTransferenciasList from '../../components/inventarios/AceitesTransferenciasList';

const AceitesInventarioPage = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<AceitesInventarioDashboard />} />
                <Route path="/bodega" element={<AceitesBodegaList />} />
                <Route path="/dispensarios" element={<AceitesDispensarioList />} />
                <Route path="/compras/nueva" element={<CompraAceiteForm />} />
                <Route path="/surtir" element={<SurtirAceiteForm />} />
                <Route path="/transferencias" element={<AceitesTransferenciasList />} />
            </Routes>
        </Layout>
    );
};

export default AceitesInventarioPage;