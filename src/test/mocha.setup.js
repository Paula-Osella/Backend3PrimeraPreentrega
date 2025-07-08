import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

before(async function () {
    this.timeout(20000);
    console.log('--- Conectando a la base de datos de pruebas ---');
    try {

        await mongoose.connect(process.env.MONGO_URL);
        console.log('--- Conexión a MongoDB establecida ---');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
});

after(async function () {
    console.log('--- Desconectando de la base de datos de pruebas ---');
    try {
        await mongoose.disconnect();
        console.log('--- Conexión a MongoDB cerrada ---');
    } catch (error) {
        console.error('Error al desconectar de MongoDB:', error);
    }
});