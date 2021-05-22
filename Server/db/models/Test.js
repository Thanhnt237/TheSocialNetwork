const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    fruit: {
      type: String
    },
    animal: {
      type: String,
      default: "Tigar"
    },
    things: {
      type: String
    }
})

module.exports = mongoose.model('Test', TestSchema)
