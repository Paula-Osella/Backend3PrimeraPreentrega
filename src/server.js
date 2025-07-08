// server.js
import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './config/logger.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    logger.info('✅ MongoDB conectado correctamente');
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor escuchando en: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    logger.fatal(`❌ Error conectando a MongoDB: ${err.message}`);
  });
