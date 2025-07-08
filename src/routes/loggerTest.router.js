import { Router } from 'express';
import logger from '../config/logger.js'; 

const router = Router();

router.get('/', (req, res) => {
    logger.debug('🪛 Este es un mensaje DEBUG');
    logger.http('🌐 Este es un mensaje HTTP');
    logger.info('ℹ️ Este es un mensaje INFO');
    logger.warning('⚠️ Este es un mensaje WARNING');
    logger.error('❌ Este es un mensaje ERROR');
    logger.fatal('💀 Este es un mensaje FATAL');

    res.status(200).send({
        status: 'success',
        message: 'Se generaron logs de todos los niveles. Revisá la consola y/o el archivo errors.log si estás en producción.'
    });
});

export default router;
