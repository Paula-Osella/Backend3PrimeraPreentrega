import multer from 'multer';
import __dirname from './index.js';
import fs from 'fs';
import path from 'path';

const petsPath = path.join(__dirname, 'public', 'pets');


if (!fs.existsSync(petsPath)) {
    fs.mkdirSync(petsPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, petsPath);
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({ storage });

export default uploader;
