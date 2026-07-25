import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // ==============================================
            // TODAS LAS RUTAS VAN AL GATEWAY (puerto 8085)
            // ==============================================
            '/api': {
                target: 'http://localhost:8085',
                changeOrigin: true,
                // No reescribir la URL, el Gateway ya tiene las rutas configuradas
            }
        }
    }
})