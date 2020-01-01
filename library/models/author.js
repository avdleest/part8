const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
    min: [0, 'The year should be at least 0'],
    max: [3000, 'The year should be maximum 3000']
  },
})

module.exports = mongoose.model('Author', schema)