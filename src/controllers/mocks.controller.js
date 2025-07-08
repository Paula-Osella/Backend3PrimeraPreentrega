import PetModel from '../dao/models/Pet.js';
import userModel from '../dao/models/User.js';
import bcrypt from 'bcrypt';
import { generateMockUsers, generateMockPets } from '../utils/mocking.js';
import { DEFAULT_PASSWORD, BCRYPT_SALT_ROUNDS } from '../config/constants.js';
import logger from '../config/logger.js'; 

export const generateMockPetsController = async (req, res, next) => {
    try {
        const fakePets = generateMockPets(100);

        logger.debug('🐶 Se generaron 100 mascotas falsas (sin guardar en DB)');
        res.status(200).json({
            status: 'success',
            message: 'Se generaron 100 mascotas falsas (sin guardar en DB).',
            payload: fakePets,
        });
    } catch (error) {
        logger.error('❌ Error al generar mascotas mock:', error);
        next(error);
    }
};

export const generateMockUsersController = async (req, res, next) => {
    try {
        const count = parseInt(req.query.count) || 50;

        if (isNaN(count) || count <= 0) {
            logger.warn(`⚠️ Parámetro inválido "count": ${req.query.count}`);
            return res.status(400).json({
                status: 'error',
                message: 'El parámetro "count" debe ser un número entero positivo.',
            });
        }

        const rawUsers = generateMockUsers(count);

        const usersWithHashedPasswords = await Promise.all(
            rawUsers.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_SALT_ROUNDS),
            }))
        );

        logger.debug(`👥 Se generaron ${usersWithHashedPasswords.length} usuarios falsos (sin guardar en DB)`);
        res.status(200).json({
            status: 'success',
            message: `Se generaron ${usersWithHashedPasswords.length} usuarios falsos (sin guardar en DB).`,
            payload: usersWithHashedPasswords,
        });
    } catch (error) {
        logger.error('❌ Error al generar usuarios mock:', error);
        next(error);
    }
};

export const generateDataController = async (req, res, next) => {
    try {
        const { users = 0, pets = 0 } = req.body;

        const usersCount = Number(users);
        const petsCount = Number(pets);

        if (
            !Number.isInteger(usersCount) || usersCount < 0 ||
            !Number.isInteger(petsCount) || petsCount < 0
        ) {
            logger.warn(`⚠️ Parámetros inválidos al generar datos: users=${users}, pets=${pets}`);
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros "users" y "pets" deben ser números enteros positivos o cero.',
            });
        }

        const rawUsers = generateMockUsers(usersCount);
        const usersWithHashedPasswords = await Promise.all(
            rawUsers.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_SALT_ROUNDS),
            }))
        );

        const fakePets = generateMockPets(petsCount);

        const insertedUsers = usersCount > 0
            ? await userModel.insertMany(usersWithHashedPasswords)
            : [];

        const insertedPets = petsCount > 0
            ? await PetModel.insertMany(fakePets)
            : [];

        logger.info(`✅ Se insertaron ${insertedUsers.length} usuarios y ${insertedPets.length} mascotas en la base de datos`);
        res.status(201).json({
            status: 'success',
            message: `Se insertaron ${insertedUsers.length} usuarios y ${insertedPets.length} mascotas en la base de datos.`,
            insertedUsers: insertedUsers.length,
            insertedPets: insertedPets.length,
        });
    } catch (error) {
        logger.error('❌ Error al insertar datos mock en DB:', error);
        next(error);
    }
};
