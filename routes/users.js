const router = require('express').Router();
const { validateUpdateUser } = require('../middlewares/validations');

const {
  getProfile,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getProfile);
router.patch('/users/me', validateUpdateUser, updateUser);

module.exports = router;
