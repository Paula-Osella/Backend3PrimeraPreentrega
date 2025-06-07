import { faker } from '@faker-js/faker';
import { DEFAULT_PASSWORD } from '../config/constants.js';

/**
 * Genera usuarios falsos con datos realistas.
 * La contraseña es constante, se encripta luego en los controladores.
 */
export const generateMockUsers = (quantity) => {
  return Array.from({ length: quantity }, () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: DEFAULT_PASSWORD,
    role: faker.helpers.arrayElement(['user', 'admin']),
    pets: [],
  }));
};

/**
 * Genera mascotas falsas, todas sin dueño y no adoptadas.
 */
export const generateMockPets = (quantity) => {
  return Array.from({ length: quantity }, () => ({
    name: faker.animal.dog(),
    species: 'dog',
    age: faker.number.int({ min: 1, max: 15 }),
    adopted: false,
    owner: null,
  }));
};