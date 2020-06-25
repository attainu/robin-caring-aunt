const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const { check, validationResult } = require('express-validator');
const { create, getData, update, remove } = require('../controllers/menstrualController/control');


router.post('/menst', [
  check('pastPeriodDate', 'In Past-Period-Date only numeric values are allowed').isNumeric(),
  check('menstrualCycleLength', 'In Menstrual-Cycle-Length only numeric values are allowed').isNumeric(),
  check('periodLength', 'In Period-Length only numeric values are allowed').isNumeric()
], auth, create);

router.get('/menst', auth, getData);

router.patch('/menst', auth, update);

router.delete('/menst', auth, remove);


module.exports = router;