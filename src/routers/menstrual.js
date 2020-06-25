const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const control = require('../controllers/menstrualController')


router.post('/menst', auth, control.create)

router.get('/menst', auth, control.getData)

router.patch('/menst', auth, control.update)

router.delete('/menst', auth, control.remove)


module.exports = router;