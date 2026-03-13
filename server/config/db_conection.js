import mongoose from 'mongoose';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const MONGODB_URI = process.env.MONGODB_URI;

      if (!MONGODB_URI) {
        throw new Error('MONGODB_URI no está definida en las variables de entorno');
      }

      // Opciones modernas y soportadas
      const options = {
        // serverSelectionTimeoutMS: 5000, // tiempo máximo para seleccionar servidor
        // connectTimeoutMS: 10000,        // timeout de conexión
        // family: 4,                      // forzar IPv4 si es necesario
      };

      this.connection = await mongoose.connect(MONGODB_URI, options);

      console.log('✅ Conectado a MongoDB Atlas exitosamente');
      console.log(`📊 Base de datos: ${this.connection.connection.name}`);

      mongoose.connection.on('error', (err) => {
        console.error('❌ Error de conexión a MongoDB:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ Desconectado de MongoDB');
      });

      return this.connection;

    } catch (error) {
      console.error('❌ Error al conectar a MongoDB:', error);
      process.exit(1);
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
