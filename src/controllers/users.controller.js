import { usersService } from "../services/index.js";
import logger from "../config/logger.js";

const getAllUsers = async (req, res) => {
    const users = await usersService.getAll();
    logger.info("Se obtuvieron todos los usuarios.");
    res.send({ status: "success", payload: users });
};

const getUser = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
        logger.warning(`Usuario con ID ${userId} no encontrado.`);
        return res.status(404).send({ status: "error", error: "User not found" });
    }
    logger.info(`Se obtuvo el usuario con ID: ${userId}`);
    res.send({ status: "success", payload: user });
};

const updateUser = async (req, res) => {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
        logger.warning(`No se puede actualizar: Usuario con ID ${userId} no encontrado.`);
        return res.status(404).send({ status: "error", error: "User not found" });
    }
    const result = await usersService.update(userId, updateBody);
    logger.info(`Usuario actualizado con ID: ${userId}`);
    res.send({ status: "success", message: "User updated" });
};

const deleteUser = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);

    if (!user) {
        logger.warning(`Intento de eliminar usuario con ID inexistente: ${userId}`);
        return res.status(404).send({ status: "error", error: "User not found" });
    }

    await usersService.delete(userId); // 🔥 Ahora sí lo elimina de verdad
    logger.info(`Usuario eliminado con ID: ${userId}`);
    res.send({ status: "success", message: "User deleted" });
};

const uploadDocuments = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
        logger.warning(`Usuario con ID ${userId} no encontrado para subir documentos.`);
        return res.status(404).send({ status: "error", error: "User not found" });
    }

    const files = req.files;
    if (!files || files.length === 0) {
        logger.warning("No se recibieron archivos.");
        return res.status(400).send({ status: "error", error: "No files uploaded" });
    }

    const documents = files.map(file => ({
        name: file.originalname,
        reference: `/documents/${file.filename}`
    }));

    const updatedUser = await usersService.addDocuments(userId, documents);

    logger.info(`Se subieron documentos para el usuario con ID: ${userId}`);
    res.send({ status: "success", message: "Documents uploaded", payload: documents });
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    uploadDocuments
};
