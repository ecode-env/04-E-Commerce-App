import express from 'express';
import { createUser, loginUserCtrl } from '../controller/userCtrl.js'
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);


export default router;