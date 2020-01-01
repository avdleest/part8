const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2
  },
  published: {
    type: Number,
    required: true,
    min: [0, 'The year should be at least 0'],
    max: [3000, 'The year should be maximum 3000']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
    minlength: 5
  },
  genres: [
    { type: String }
  ]
})

module.exports = mongoose.model('Book', schema)