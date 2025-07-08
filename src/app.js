// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mockRouter from './routes/mocks.router.js';
import loggerTestRouter from './routes/loggerTest.router.js';
import { setupSwagger } from './swagger.js';
import path from 'path';
import __dirname from './utils/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import logger from './config/logger.js';

const app = express();

app.use(compression());
app.use(express.json());
app.use(cookieParser());
setupSwagger(app);
// Rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mockRouter);
app.use('/api/loggerTest', loggerTestRouter);
app.use(express.static(path.join(__dirname, 'public')));
// Ruta no encontrada
app.use((req, res, next) => {
  logger.warning(`⚠️ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).send({ status: 'error', message: 'Ruta no encontrada' });
});

app.use(errorHandler);

export default app;
