const express = require('express');
const router = new express.Router();
const Menstrual = require('../models/menstrualModel')
const auth = require('../middlewares/auth');
const dateCalc = require('../middlewares/dateCalc')
const control = require('../controllers/menstrualController')


router.post('/menst', auth, dateCalc, control.create)

router.get('/menst', auth, control.getData)

router.patch('/menst', auth, dateCalc, control.update)

router.delete('/menst', auth, control.remove)


module.exports = router;