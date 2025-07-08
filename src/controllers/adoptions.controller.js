import { adoptionsService, petsService, usersService } from "../services/index.js";
import logger from '../config/logger.js'; 

const getAllAdoptions = async (req, res, next) => {
  try {
    const result = await adoptionsService.getAll();
    logger.info(`Se obtuvieron todas las adopciones, total: ${result.length}`);
    res.send({ status: "success", payload: result });
  } catch (error) {
    logger.error(`Error en getAllAdoptions: ${error.message}`);
    next(error);
  }
};

const getAdoption = async (req, res, next) => {
  try {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    if (!adoption) {
      logger.warn(`Adoption no encontrada con id: ${adoptionId}`);
      return res.status(404).send({ status: "error", error: "Adoption not found" });
    }
    logger.info(`Adoption encontrada con id: ${adoptionId}`);
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    if (error.name === "CastError") {
      logger.warn(`ID inválido para adopción: ${req.params.aid}`);
      return res.status(400).send({ status: "error", error: "Invalid Adoption ID" });
    }
    logger.error(`Error en getAdoption: ${error.message}`);
    next(error);
  }
};


const createAdoption = async (req, res, next) => {
  try {
    const { uid, pid } = req.params;
    const user = await usersService.getUserById(uid);
    if (!user) {
      logger.warn(`Usuario no encontrado con id: ${uid}`);
      return res.status(404).send({ status: "error", error: "user Not found" });
    }
    const pet = await petsService.getBy({ _id: pid });
    if (!pet) {
      logger.warn(`Mascota no encontrada con id: ${pid}`);
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }
    if (pet.adopted) {
      logger.warn(`Intento de adoptar mascota ya adoptada, id: ${pid}`);
      return res.status(400).send({ status: "error", error: "Pet is already adopted" });
    }
    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    await adoptionsService.create({ owner: user._id, pet: pet._id });

    logger.info(`Adopción creada con usuario ${uid} y mascota ${pid}`);
    res.send({ status: "success", message: "Pet adopted" });
  } catch (error) {
    logger.error(`Error en createAdoption: ${error.message}`);
    next(error);
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
