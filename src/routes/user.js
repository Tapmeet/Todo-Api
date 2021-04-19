const express = require('express');
const User = require('../controllers/user');
const router = express.Router();
/**
 * Upload Profile Image
 */
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/Assets/User');
  },
  filename: function(req, file, cb) {
    const fileName = file.originalname.split(' ').join(''); ;
    cb(null, file.fieldname + '-' + Date.now() +'-'+ fileName);
  },
});
const upload = multer({storage: storage});
// INDEX
router.get('/', User.index);

// SHOW
router.get('/:id', User.show);

// UPDATE
router.put('/:id', User.update);

// DELETE
router.delete('/:id', User.destroy);

// UPLOAD
router.post('/upload', upload.single('profileImage'), User.upload);

module.exports = router;


