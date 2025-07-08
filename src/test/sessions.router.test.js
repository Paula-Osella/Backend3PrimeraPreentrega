import supertest from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../app.js'; 

const requester = supertest(app);

describe('Sessions Router', function () {
    this.timeout(10000);

    const testUser = {
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        password: '123456'
    };



    describe('POST /api/sessions/register', () => {
        beforeEach(async () => {
            await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
        });

        it('Debe registrar un usuario nuevo', async () => {
            const res = await requester
                .post('/api/sessions/register')
                .send(testUser);

            expect(res.status).to.equal(201); 
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('payload');
        });

        it('Debe fallar si faltan datos', async () => {
            const res = await requester
                .post('/api/sessions/register')
                .send({ email: 'incompleto@example.com' });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Incomplete values');
        });

        it('Debe fallar si el usuario ya existe', async () => {
            await requester.post('/api/sessions/register').send(testUser);

            const res = await requester
                .post('/api/sessions/register')
                .send(testUser);

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'User already exists');
        });
    });

    describe('POST /api/sessions/login', () => {
        beforeEach(async () => {
            await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
            await requester.post('/api/sessions/register').send(testUser);
        });

        it('Debe iniciar sesión correctamente', async () => {
            const res = await requester
                .post('/api/sessions/login')
                .send({ email: testUser.email, password: testUser.password });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'Logged in');
            expect(res.headers['set-cookie']).to.exist;
        });

        it('Debe fallar si faltan datos', async () => {
            const res = await requester
                .post('/api/sessions/login')
                .send({ email: testUser.email });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Incomplete values');
        });

        it('Debe fallar si el usuario no existe', async () => {
            await mongoose.connection.collection('users').deleteOne({ email: testUser.email });

            const res = await requester
                .post('/api/sessions/login')
                .send({ email: 'noexiste@example.com', password: '123456' });

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('error', "User doesn't exist");
        });

        it('Debe fallar si la contraseña es incorrecta', async () => {
            const res = await requester
                .post('/api/sessions/login')
                .send({ email: testUser.email, password: 'wrongpass' });

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error', 'Incorrect password');
        });
    });

    after(async () => {
        await mongoose.connection.collection('users').deleteOne({ email: testUser.email });
    });
});