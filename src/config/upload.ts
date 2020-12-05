import multer from 'multer';
import path from 'path';

export default {
    storage: multer.diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads'),
        filename: (request, file, cb) => {
            // nome do arquivo
            const fileName = `${Date.now()}-${file.originalname}`;
            // funcao de callback
            cb(null, fileName);
        },
    })   
}