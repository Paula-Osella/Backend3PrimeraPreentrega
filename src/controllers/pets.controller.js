import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import logger from "../config/logger.js";

// 🐾 Obtener todas las mascotas
const getAllPets = async (req, res) => {
    try {
        const pets = await petsService.getAll();
        logger.info("Se obtuvieron todas las mascotas.");
        res.send({ status: "success", payload: pets });
    } catch (error) {
        logger.error("Error al obtener todas las mascotas:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

// 🐾 Crear una nueva mascota (sin imagen)
const createPet = async (req, res) => {
    try {
        const { name, species, birthDate } = req.body;
        if (!name || !species || !birthDate) {
            logger.warning("Faltan campos obligatorios para crear una mascota.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const pet = PetDTO.getPetInputFrom({ name, species, birthDate });
        const result = await petsService.create(pet);
        logger.info(`Mascota creada con ID: ${result._id}`);
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        logger.error("Error al crear una mascota:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

// 🐾 Actualizar mascota por ID
const updatePet = async (req, res) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId, petUpdateBody);
        if (!result) {
            logger.warning(`Mascota con ID ${petId} no encontrada para actualizar.`);
            return res.status(404).send({ status: "error", error: "Pet not found" });
        }

        logger.info(`Mascota actualizada con ID: ${petId}`);
        res.send({ status: "success", message: "Pet updated" });
    } catch (error) {
        logger.error(`Error al actualizar mascota con ID ${req.params.pid}:`, error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

// 🐾 Eliminar mascota por ID
const deletePet = async (req, res) => {
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);
        if (!result || (result.deletedCount !== undefined && result.deletedCount === 0)) {
            logger.warning(`Mascota con ID ${petId} no encontrada para eliminar.`);
            return res.status(404).send({ status: "error", error: "Pet not found" });
        }

        logger.info(`Mascota eliminada con ID: ${petId}`);
        res.send({ status: "success", message: "Pet deleted" });
    } catch (error) {
        logger.error(`Error al eliminar mascota con ID ${req.params.pid}:`, error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

// 🐾 Crear mascota con imagen
const createPetWithImage = async (req, res) => {
    try {
        const file = req.file;
        const { name, species, birthDate } = req.body;

        if (!name || !species || !birthDate || !file) {
            logger.warning("Faltan campos para crear mascota con imagen.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const imagePath = `/pets/${file.filename}`;

        const pet = PetDTO.getPetInputFrom({
            name,
            species,
            birthDate,
            image: imagePath
        });

        logger.debug("Mascota generada:", pet);
        const result = await petsService.create(pet);
        logger.info(`Mascota con imagen creada con ID: ${result._id}`);
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        logger.error("Error al crear mascota con imagen:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

// 🐾 Obtener mascota por ID
const getPetById = async (req, res) => {
    try {
        const petId = req.params.pid;
        const pet = await petsService.getById(petId);
        if (!pet) {
            logger.warning(`Mascota con ID ${petId} no encontrada.`);
            return res.status(404).send({ status: "error", error: "Pet not found" });
        }
        logger.info(`Mascota con ID ${petId} obtenida exitosamente.`);
        res.send({ status: "success", payload: pet });
    } catch (error) {
        logger.error(`Error al obtener mascota con ID ${req.params.pid}:`, error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage,
    getPetById
};