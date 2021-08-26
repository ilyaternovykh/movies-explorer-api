require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const getProfile = (req, res, next) => User.findOne({ _id: req.user._id })
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }

    return res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Невалидный id');
    }

    next(err);
  })
  .catch(next);

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Отсутствует email или пароль');
  }

  return User.create({
    email,
    password,
    name,
  })
    .then((user) => res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError('При регистрации указан email, который уже существует на сервере');
      }

      next(err);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          throw new BadRequestError('Невалидный id');
        case 'ValidationError':
          throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
        default:
          next(err);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Отсутствует email или пароль');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      // создание токена
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUser, getProfile, updateUser, login,
};
