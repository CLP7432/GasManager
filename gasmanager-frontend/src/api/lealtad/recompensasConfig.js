import axios from 'axios';

export const recompensasService = {
    listar: async () => {
        const response = await axios.get('/api/recompensas');
        return response.data;
    },
    crear: async (recompensa) => {
        const response = await axios.post('/api/recompensas', recompensa);
        return response.data;
    },
    actualizar: async (id, recompensa) => {
        const response = await axios.put(`/api/recompensas/${id}`, recompensa);
        return response.data;
    },
    eliminar: async (id) => {
        await axios.delete(`/api/recompensas/${id}`);
    }
};
