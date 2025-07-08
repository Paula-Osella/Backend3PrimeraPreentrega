import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import logger from "../config/logger.js"; 

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            logger.warning("Intento de registro con datos incompletos.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            logger.warning(`Registro fallido: el usuario ${email} ya existe.`);
            return res.status(400).send({ status: "error", error: "User already exists" });
        }
        const hashedPassword = await createHash(password);
        const user = { first_name, last_name, email, password: hashedPassword };
        let result = await usersService.create(user);
        logger.info(`Nuevo usuario registrado: ${email}`);
        res.status(201).send({ status: "success", payload: result._id }); 
    } catch (error) {
        logger.error("Error en el registro de usuario:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            logger.warning("Intento de login con datos incompletos.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            logger.warning(`Login fallido: usuario ${email} no existe.`);
            return res.status(404).send({ status: "error", error: "User doesn't exist" });
        }
        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            logger.warning(`Login fallido: contraseña incorrecta para ${email}.`);
            return res.status(400).send({ status: "error", error: "Incorrect password" });
        }

        await usersService.update(user._id, { last_connection: new Date() });

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
        logger.info(`Usuario ${email} inició sesión correctamente.`);
        res.cookie("coderCookie", token, { maxAge: 3600000, httpOnly: true }).send({ status: "success", message: "Logged in" });
    } catch (error) {
        logger.error("Error en el login de usuario:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

const logout = async (req, res) => {
    try {
        const cookie = req.cookies["coderCookie"];
        if (!cookie) {
            logger.warning("Intento de logout sin cookie de sesión.");
            return res.status(401).send({ status: "error", error: "No active session" });
        }

        let decoded;
        try {
            decoded = jwt.verify(cookie, "tokenSecretJWT");
        } catch (jwtError) {
            logger.warning(`Token inválido o expirado durante logout: ${jwtError.message}`);
            return res.status(401).send({ status: "error", error: "Invalid or expired token" });
        }

        if (!decoded || !decoded.email) {
            logger.warning("Token decodificado no válido o sin email durante logout.");
            return res.status(401).send({ status: "error", error: "Invalid token payload" });
        }

        const user = await usersService.getUserByEmail(decoded.email);
        if (user) {
            await usersService.update(user._id, { last_connection: new Date() });
            logger.info(`Usuario ${user.email} cerró sesión. Última conexión registrada.`);
        } else {
            logger.warning(`Usuario de token ${decoded.email} no encontrado durante logout, pero se procede a limpiar cookie.`);
        }

        res.clearCookie("coderCookie").send({ status: "success", message: "Logged out" });
    } catch (error) {
        logger.error("Error durante logout:", error);
        res.status(500).send({ status: "error", error: "Logout failed" });
    }
};

const current = async (req, res) => {
    try {
        const cookie = req.cookies["coderCookie"];
        if (!cookie) {
            logger.warning("Acceso a /current sin cookie de sesión.");
            return res.status(401).send({ status: "error", error: "No active session / Cookie missing" });
        }
        
        const user = jwt.verify(cookie, "tokenSecretJWT");
        
        logger.info(`Token verificado para el usuario: ${user.email}`);
        return res.send({ status: "success", payload: user });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            logger.warning(`Token JWT inválido o expirado para /current: ${error.message}`);
            res.clearCookie("coderCookie");
            return res.status(401).send({ status: "error", error: "Invalid or expired token" });
        }
        logger.error("Error en el endpoint /current:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

const unprotectedLogin = async (req, res) => {
    try {
        const { email, password } = req.query;

        if (!email || !password) {
            logger.warning("Intento de unprotectedLogin con datos incompletos.");
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }

        const user = await usersService.getUserByEmail(email);
        if (!user) {
            logger.warning(`UnprotectedLogin fallido: usuario ${email} no existe.`);
            return res.status(404).send({ status: "error", error: "User doesn't exist" });
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            logger.warning(`UnprotectedLogin fallido: contraseña incorrecta para ${email}.`);
            return res.status(400).send({ status: "error", error: "Incorrect password" });
        }

        const token = jwt.sign(UserDTO.getUserTokenFrom(user), "tokenSecretJWT", { expiresIn: "1h" });

        logger.info(`Usuario ${email} inició sesión sin protección.`);
        res.cookie("unprotectedCookie", token, { maxAge: 3600000, httpOnly: true }).send({ status: "success", message: "Unprotected Logged in" });
    } catch (error) {
        logger.error("Error en el endpoint unprotectedLogin:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

const unprotectedCurrent = async (req, res) => {
    try {
        const cookie = req.cookies["unprotectedCookie"];
        if (!cookie) {
            logger.warning("Acceso a /unprotectedCurrent sin cookie.");
            return res.status(401).send({ status: "error", error: "No active session / Cookie missing" });
        }

        const user = jwt.verify(cookie, "tokenSecretJWT");
        
        logger.info(`Token verificado sin protección para usuario: ${user.email}`);
        return res.send({ status: "success", payload: user });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            logger.warning(`Token JWT inválido o expirado para /unprotectedCurrent: ${error.message}`);
            res.clearCookie("unprotectedCookie");
            return res.status(401).send({ status: "error", error: "Invalid or expired token" });
        }
        logger.error("Error en el endpoint unprotectedCurrent:", error);
        res.status(500).send({ status: "error", error: "Internal Server Error" });
    }
};

export default {
    current,
    login,
    logout,
    register,
    unprotectedLogin,
    unprotectedCurrent
};