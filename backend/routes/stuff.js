const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer.config');

router.post('/', auth.authentication, multer, stuffCtrl.createThing)
router.put('/:id', auth.authentication, multer, stuffCtrl.modifyThing)
router.delete('/:id', auth.authentication, stuffCtrl.deleteThing)
router.get('/:id', auth.authentication, stuffCtrl.getOneThing)
router.get('/', auth.authentication , stuffCtrl.getAllThings)

  module.exports = router;