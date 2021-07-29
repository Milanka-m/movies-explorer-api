const mongoose = require('mongoose');

const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  duration: {
    type: Number,
    required: true,
    minlength: 2,
  },

  year: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4,
  },

  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        validator.isURL(value, {
          require_protocol: true,
          require_port: true,
        });
      },
    },
  },

  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        validator.isURL(value, {
          require_protocol: true,
          require_port: true,
        });
      },
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        validator.isURL(value, {
          require_protocol: true,
          require_port: true,
        });
      },
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: (v) => /^[а-яё0-9\s]+$/i.test(v),
    },
  },

  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: (v) => /^[a-z0-9\s]+$/i.test(v),
    },
  },

});

module.exports = mongoose.model('movie', movieSchema);
