import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';

import { sendText } from './app/useCases/sendText';
import { leaveGroup } from './app/useCases/leaveGroup';

export const router = Router();

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, callback){
            callback(null, path.resolve(__dirname, '..', 'uploads'));
        },
        filename(req, file, callback){
            callback(null, `${Date.now()}-${file.originalname}`);
        }
    }),
});

// Send Simple Text
router.post('/sendText', sendText);

// Leave a Group
router.post('/leaveGroup', leaveGroup);