const mongoose = require('mongoose')

const SearchHistoriesSchema = new mongoose.Schema({
    User_ID:{
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    content:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('SearchHistories', SearchHistoriesSchema)
