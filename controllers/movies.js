const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(200).send(movies))
  .catch(next);

const createMovie = (req, res, next) => {
  const data = { ...req.body };
  data.owner = req.user._id;

  return Movie.create(data)
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          next(new BadRequestError('Переданы некорректные данные при добавлении фильма'));
          break;
        default:
          next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      } if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Попытка удалить чужой фильм');
      }

      return Movie.deleteOne({ _id: req.params.movieId })
        .then((selectedMovie) => {
          res.status(200).send(selectedMovie);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id ');
      }

      next(err);
    })
    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
