import { Router } from 'express';
import petsController from '../controllers/pets.controller.js';
import uploader from '../utils/uploader.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Pets
 *     description: Endpoints para gestión de mascotas
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida exitosamente
 */
router.get('/', petsController.getAllPets);
/**
/**
 * @swagger
 * /pets/{pid}:
 *   get:
 *     summary: Obtener una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a buscar
 *     responses:
 *       200:
 *         description: Mascota obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Mascota no encontrada
 */

router.get('/:pid', petsController.getPetById);
/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specie
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *               specie:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Mascota creada exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 */
router.post('/', petsController.createPet);

/**
 * @swagger
 * /pets/withimage:
 *   post:
 *     summary: Crear mascota con imagen (formulario multipart)
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - birthDate
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Mascota con imagen creada exitosamente
 *       400:
 *         description: Faltan datos requeridos
 */
router.post('/withimage', uploader.single('image'), petsController.createPetWithImage);

/**
 * @swagger
 * /pets/{pid}:
 *   put:
 *     summary: Actualizar una mascota existente
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
 */
router.put('/:pid', petsController.updatePet);

/**
 * @swagger
 * /pets/{pid}:
 *   delete:
 *     summary: Eliminar una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a eliminar
 *     responses:
 *       200:
 *         description: Mascota eliminada exitosamente
 */
router.delete('/:pid', petsController.deletePet);

export default router;
