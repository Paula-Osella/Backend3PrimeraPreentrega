import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Sessions
 *     description: Endpoints relacionados al login y autenticación de usuarios
 */

/**
 * @swagger
 * /sessions/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Valores incompletos o usuario ya existe
 */
router.post('/register', sessionsController.register);

/**
 * @swagger
 * /sessions/login:
 *   post:
 *     summary: Iniciar sesión con correo y contraseña
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: paula@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente, cookie establecida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged in
 *       400:
 *         description: Credenciales inválidas o valores faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Incomplete values
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: User doesn't exist
 */
router.post('/login', sessionsController.login);


/**
 * @swagger
 * /sessions/current:
 *   get:
 *     summary: Obtener usuario actual autenticado mediante cookie
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       401:
 *         description: Token inválido o no presente
 */
router.get('/current', sessionsController.current);

/**
 * @swagger
 * /sessions/unprotectedLogin:
 *   get:
 *     summary: Login sin protección JWT (solo para test)
 *     tags: [Sessions]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Sesión iniciada sin protección
 *       400:
 *         description: Valores incompletos o contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/unprotectedLogin', sessionsController.unprotectedLogin);

/**
 * @swagger
 * /sessions/unprotectedCurrent:
 *   get:
 *     summary: Obtener usuario autenticado sin protección JWT (solo para test)
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/unprotectedCurrent', sessionsController.unprotectedCurrent);

/**
 * @swagger
 * /sessions/logout:
 *   post:
 *     summary: Cerrar sesión (borrar cookie)
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Sesión cerrada
 *       401:
 *         description: No había sesión activa
 */
router.post('/logout', sessionsController.logout);

export default router;
