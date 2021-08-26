const express = require('express');
const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { validateNewUser, validateOldUser } = require('../middlewares/validations');
const NotFoundError = require('../errors/not-found-err');

router.use('/', express.json());
router.post('/signup', validateNewUser, createUser);
router.post('/signin', validateOldUser, login);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
