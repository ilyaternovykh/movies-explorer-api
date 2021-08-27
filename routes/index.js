const express = require('express');
const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { validateNewUser, validateOldUser } = require('../middlewares/validations');
const NotFoundError = require('../errors/not-found-err');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const movieRouter = require('./movies');

router.use('/', express.json());
router.post('/signup', validateNewUser, createUser);
router.post('/signin', validateOldUser, login);

router.use(auth);
router.use('/', usersRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
