import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


import userModel from '../dao/models/User.js';


before(async () => {
    await mongoose.connect(process.env.MONGO_URL);
});


beforeEach(async () => {
    await userModel.deleteMany({});
});


after(async () => {
    await mongoose.disconnect();
});

describe('Users Router - Integración', () => {
    describe('GET /api/users', () => {
        it('debe devolver todos los usuarios con status 200', async () => {
            const res = await request(app).get('/api/users');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('payload').that.is.an('array');
        });
    });

    describe('GET /api/users/:uid', () => {
        it('debe devolver un usuario válido con status 200', async () => {

            const createRes = await request(app).post('/api/sessions/register').send({
                first_name: 'Valid',
                last_name: 'User',
                email: 'validuser@test.com',
                password: '123456'
            });
            const validUserId = createRes.body.payload;

            const res = await request(app).get(`/api/users/${validUserId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.payload).to.have.property('_id', validUserId);
        });

        it('debe devolver 404 si el usuario no existe', async () => {
            const res = await request(app).get('/api/users/507f1f77bcf86cd799439011');
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('error', 'User not found');
        });
    });

    describe('DELETE /api/users/:uid', () => {
        it('debe eliminar un usuario existente y devolver status 200', async () => {
            const createRes = await request(app).post('/api/sessions/register').send({
                first_name: 'Test',
                last_name: 'User',
                email: 'deleteuser@test.com',
                password: '123456'
            });
            const newUserId = createRes.body.payload;

            const res = await request(app).delete(`/api/users/${newUserId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'User deleted');
        });
    });

    describe('PUT /api/users/:uid', () => {
        it('debe actualizar un usuario existente y devolver status 200', async () => {
            const createRes = await request(app).post('/api/sessions/register').send({
                first_name: 'Update',
                last_name: 'User',
                email: 'updateuser@test.com',
                password: '123456'
            });
            const newUserId = createRes.body.payload;

            const res = await request(app).put(`/api/users/${newUserId}`).send({
                first_name: 'Updated'
            });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'User updated');
        });
    });
});

