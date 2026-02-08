import express from 'express';
import cors from 'cors';
import database from './config/database.js';
import userRoutes from './routes/main_routes.js';
import reservationRoutes from './routes/reservation_routes.js';

const app = express();
const PORT = process.env.PORT || 5100;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
database.connect();

// Rutas
app.use('/bread_network', userRoutes);
app.use('/bread_network/reservations', reservationRoutes); // ← NUEVA RUTA

// Ruta de prueba
app.get('/', (req, res) => {
    res.send({
        message: 'Servidor de Bread Network funcionando',
        status: database.getConnectionStatus()
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Manejar cierre graceful
process.on('SIGINT', async () => {
    console.log('\n⚠️ Cerrando servidor...');
    await database.disconnect();
    process.exit(0);
});

export default app;