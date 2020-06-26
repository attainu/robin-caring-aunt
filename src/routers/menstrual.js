import express from 'express';
import auth from '../middlewares/auth';
import { check, validationResult } from 'express-validator';
import { create, getData, update, remove } from '../controllers/menstrualController';

const router = new express.Router();

router.post('/menst', [
  check('pastPeriodDate', 'In Past-Period-Date only numeric values are allowed'),
  check('menstrualCycleLength', 'In Menstrual-Cycle-Length only numeric values are allowed').isNumeric(),
  check('periodLength', 'In Period-Length only numeric values are allowed').isNumeric()
], auth, create);

router.get('/menst', auth, getData);

router.patch('/menst', auth, update);

router.delete('/menst', auth, remove);


export default router;