import multer from 'multer';
import __dirname from './index.js';
import fs from 'fs';
import path from 'path';

const documentsPath = path.join(__dirname, 'public', 'documents');


if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploaderDocuments = multer({ storage });

export default uploaderDocuments;
