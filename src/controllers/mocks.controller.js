import PetModel from '../dao/models/Pet.js';
import userModel from '../dao/models/User.js';
import bcrypt from 'bcrypt';
import { generateMockUsers, generateMockPets } from '../utils/mocking.js';
import { DEFAULT_PASSWORD, BCRYPT_SALT_ROUNDS } from '../config/constants.js';



export const generateMockPetsController = async (req, res, next) => {
    try {
        const fakePets = generateMockPets(100);

        res.status(200).json({
            status: 'success',
            message: 'Se generaron 100 mascotas falsas (sin guardar en DB).',
            payload: fakePets,
        });
    } catch (error) {
        next(error);
    }
};


export const generateMockUsersController = async (req, res, next) => {
    try {
        const rawUsers = generateMockUsers(50);

        const usersWithHashedPasswords = await Promise.all(
            rawUsers.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_SALT_ROUNDS),
            }))
        );

        res.status(200).json({
            status: 'success',
            message: `Se generaron ${usersWithHashedPasswords.length} usuarios falsos (sin guardar en DB).`,
            payload: usersWithHashedPasswords,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Genera e inserta en la base de datos la cantidad indicada de usuarios y mascotas.
 *{ users: number, pets: number }
 */
export const generateDataController = async (req, res, next) => {
    try {
        const { users = 0, pets = 0 } = req.body;

        const usersCount = Number(users);
        const petsCount = Number(pets);

        if (
            !Number.isInteger(usersCount) || usersCount < 0 ||
            !Number.isInteger(petsCount) || petsCount < 0
        ) {
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

        res.status(201).json({
            status: 'success',
            message: `Se insertaron ${insertedUsers.length} usuarios y ${insertedPets.length} mascotas en la base de datos.`,
            insertedUsers: insertedUsers.length,
            insertedPets: insertedPets.length,
        });
    } catch (error) {
        next(error);
    }
};
