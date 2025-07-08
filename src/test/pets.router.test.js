import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import petModel from '../dao/models/Pet.js';


beforeEach(async () => {
    await petModel.deleteMany({});
});

describe('Pets Router - Integración', () => {

    describe('GET /api/pets', () => {
        it('debe devolver un array vacío si no hay mascotas', async () => {
            const res = await request(app).get('/api/pets');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.payload).to.be.an('array').that.is.empty;
        });
    });

    describe('POST /api/pets', () => {
        it('debe crear una mascota correctamente', async () => {
            const newPet = {
                name: 'Firulais',
                species: 'Perro',
                birthDate: '2020-01-01'
            };

            const res = await request(app).post('/api/pets').send(newPet);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.payload).to.have.property('_id');
            expect(res.body.payload).to.include({ name: 'Firulais', species: 'Perro' });
        });

        it('debe devolver 400 si faltan campos obligatorios', async () => {
            const res = await request(app).post('/api/pets').send({
                name: 'Pelusa'
            });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error', 'Incomplete values');
        });
    });

    describe('PUT /api/pets/:pid', () => {
        it('debe actualizar una mascota correctamente', async () => {
            // 1. Crear primero una mascota
            const createRes = await request(app).post('/api/pets').send({
                name: 'Luna',
                species: 'Gato',
                birthDate: '2018-06-15'
            });
            const petId = createRes.body.payload._id;

            // 2. Actualizarla
            const res = await request(app).put(`/api/pets/${petId}`).send({
                name: 'Luna Actualizada'
            });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'Pet updated');
        });
    });

    describe('DELETE /api/pets/:pid', () => {
        it('debe eliminar una mascota correctamente', async () => {
            const createRes = await request(app).post('/api/pets').send({
                name: 'Rocky',
                species: 'Perro',
                birthDate: '2017-09-10'
            });
            const petId = createRes.body.payload._id;

            const res = await request(app).delete(`/api/pets/${petId}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'Pet deleted');
        });
    });

});