import express from 'express')
import Menstrual from '../models/menstrualModel';
import auth from '../middlewares/auth')
import dateCalc from '../middlewares/dateCalc';
import control from '../controllers/menstrualController';

const router = express.Router();

router.post('/menst', auth, dateCalc, control.create);

router.get('/menst', auth, control.getData);

router.patch('/menst', auth, dateCalc, control.update);

router.delete('/menst', auth, control.remove);

export default router;