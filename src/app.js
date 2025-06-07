import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import compression from 'compression';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mockRouter from './routes/mocks.router.js';
import { errorHandler } from './middlewares/errorHandler.js';


dotenv.config();

const app = express();
app.use(compression());
const PORT = process.env.PORT || 8080;


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB conectado correctamente'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mockRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});
