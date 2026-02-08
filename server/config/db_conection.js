import mongoose from 'mongoose';

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            // IMPORTANTE: Reemplaza esta URL con tu MongoDB Atlas connection string
            const MONGODB_URI = process.env.MONGODB_URI || 
                'mongodb+srv://usuario:password@cluster.mongodb.net/bread_network?retryWrites=true&w=majority';

            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            };

            this.connection = await mongoose.connect(MONGODB_URI, options);

            console.log('✅ Conectado a MongoDB Atlas exitosamente');
            console.log(`📊 Base de datos: ${this.connection.connection.name}`);

            // Manejar eventos de conexión
            mongoose.connection.on('error', (err) => {
                console.error('❌ Error de conexión a MongoDB:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('⚠️ Desconectado de MongoDB');
            });

            return this.connection;

        } catch (error) {
            console.error('❌ Error al conectar a MongoDB:', error);
            process.exit(1); // Salir de la aplicación si no puede conectar
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('👋 Desconectado de MongoDB');
        } catch (error) {
            console.error('❌ Error al desconectar:', error);
        }
    }

    // Obtener el estado de la conexión
    getConnectionStatus() {
        const states = {
            0: 'Desconectado',
            1: 'Conectado',
            2: 'Conectando',
            3: 'Desconectando'
        };
        return states[mongoose.connection.readyState];
    }
}

export default new Database();