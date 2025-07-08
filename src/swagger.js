// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Adoptme 🐶🐱',
            version: '1.0.0',
            description: 'Documentación de los endpoints del proyecto Adoptme (Pets, Adoptions, Sessions)',
            contact: {
                name: 'Equipo Backend Coderhouse',
                url: 'https://mi-dominio.com/terminos',
                email: 'paula@example.com'
            },
        },
        servers: [
            {
                // ✨ CAMBIO AQUÍ ✨
                url: 'http://localhost:9090/api',
                description: 'Servidor local'
            },
            {
                url: 'http://mi-dominio.com/api', 
                description: 'Servidor de Produccion'
            }
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};