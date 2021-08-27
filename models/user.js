const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new BadRequestError('Некорректный Email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  __v: {
    type: Number,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  // поиск пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Передан неверный логин или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Передан неверный логин или пароль');
          }

          return user;
        });
    });
};

userSchema.pre('save', function savePass(next) {
  if (!this.isModified('password')) return next();

  return bcrypt.hash(this.password, 10)
    .then((hash) => {
      this.password = hash;

      next();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = mongoose.model('user', userSchema);
