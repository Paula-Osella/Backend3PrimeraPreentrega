import supertest from "supertest";
import mongoose from "mongoose";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import app from "../app.js";
import userModel from "../dao/models/User.js";
import petModel from "../dao/models/Pet.js";
import adoptionModel from "../dao/models/Adoption.js";

const request = supertest(app);

describe("🧪 Adoption Router", () => {
    let testUser;
    let testPet;
    let testAdoption;

    before(async function () {
        this.timeout(20000);

        await userModel.deleteMany({});
        await petModel.deleteMany({});
        await adoptionModel.deleteMany({});

        testUser = await userModel.create({
            first_name: "Test",
            last_name: "User",
            email: "testadopt@example.com",
            password: "123456",
            role: "user",
        });

        testPet = await petModel.create({
            name: "Firulais",
            species: "Perro",
            birthDate: "2023-01-01",
            adopted: false,
        });

        testAdoption = await adoptionModel.create({
            owner: testUser._id,
            pet: testPet._id,
        });

        await petModel.updateOne({ _id: testPet._id }, { adopted: true, owner: testUser._id });

        console.log("Datos de prueba iniciales creados para Adoptions.");
    });

    after(async () => {
        console.log("Limpiando datos de prueba de Adoptions y cerrando conexión...");
        await userModel.deleteMany({});
        await petModel.deleteMany({});
        await adoptionModel.deleteMany({});
        console.log("Datos de prueba de Adoptions limpiados.");
    });

    it("GET /api/adoptions debe devolver todas las adopciones", async () => {
        const res = await request.get("/api/adoptions");
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.an("array");
        expect(res.body.payload.length).to.be.at.least(1);
    });

    it("GET /api/adoptions/:aid debe devolver una adopción existente", async () => {
        const res = await request.get(`/api/adoptions/${testAdoption._id}`);
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.payload).to.be.an("object");
        expect(res.body.payload._id).to.equal(String(testAdoption._id));
    });

    it("GET /api/adoptions/:aid con ID inexistente (válido) debe devolver error 404", async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const res = await request.get(`/api/adoptions/${nonExistentId}`);
        expect(res.statusCode).to.equal(404);
        expect(res.body.status).to.equal("error");
        expect(res.body.error).to.equal("Adoption not found");
    });

    it("GET /api/adoptions/:aid con ID inválido debe devolver error 400 o 500", async () => {
        const res = await request.get("/api/adoptions/ID_INVALIDO");
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal("error");
        expect(res.body.error).to.equal("Invalid Adoption ID");
    });

    it("POST /api/adoptions/:uid/:pid debe crear una adopción correctamente", async () => {
        const user = await userModel.create({
            first_name: "Adoptador",
            last_name: "Correcto",
            email: "adoptador@example.com",
            password: "123456",
            role: "user",
        });

        const pet = await petModel.create({
            name: "Luna",
            species: "Gato",
            birthDate: "2022-05-05",
            adopted: false,
        });

        const res = await request.post(`/api/adoptions/${user._id}/${pet._id}`);
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.message).to.equal("Pet adopted");

        const updatedPet = await petModel.findById(pet._id);
        expect(updatedPet.adopted).to.be.true;
        expect(String(updatedPet.owner)).to.equal(String(user._id));

        const updatedUser = await userModel.findById(user._id);
        expect(updatedUser.pets.map(p => String(p._id))).to.include(String(pet._id));
    });

    it("POST /api/adoptions/:uid/:pid con mascota inexistente debe devolver 404", async () => {
        const validUser = await userModel.create({
            first_name: "Valido",
            last_name: "Tester",
            email: "valido@example.com",
            password: "123456",
            role: "user",
        });

        const nonExistentPetId = new mongoose.Types.ObjectId().toString();
        const res = await request.post(`/api/adoptions/${validUser._id}/${nonExistentPetId}`);
        expect(res.statusCode).to.equal(404);
        expect(res.body.status).to.equal("error");
        expect(res.body.error).to.equal("Pet not found");
    });

    it("POST /api/adoptions/:uid/:pid con usuario inexistente debe devolver 404", async () => {
        const anotherPet = await petModel.create({
            name: "Toby",
            species: "Perro",
            birthDate: "2021-03-03",
            adopted: false,
        });

        const nonExistentUserId = new mongoose.Types.ObjectId().toString();
        const res = await request.post(`/api/adoptions/${nonExistentUserId}/${anotherPet._id}`);
        expect(res.statusCode).to.equal(404);
        expect(res.body.status).to.equal("error");
        expect(res.body.error).to.equal("user Not found");
    });

    it("POST /api/adoptions/:uid/:pid con mascota ya adoptada debe devolver 400", async () => {
        const user = await userModel.create({
            first_name: "Reintento",
            last_name: "Adoptador",
            email: "adoptador2@example.com",
            password: "123456",
            role: "user",
        });

        const pet = await petModel.create({
            name: "Lola",
            species: "Perro",
            birthDate: "2021-03-03",
            adopted: true,
            owner: user._id,
        });

        const res = await request.post(`/api/adoptions/${user._id}/${pet._id}`);
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal("error");
        expect(res.body.error).to.equal("Pet is already adopted");
    });
});
