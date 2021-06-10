let mongoose = require('mongoose');

const mongodb_url = 'mongodb+srv://Thanhdeptrai:<4!NhAaSAXQg_igb>@maincluster.mcwao.mongodb.net/DATN_TSN?retryWrites=true&w=majority'

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(mongodb_url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
            .then(() => {
                console.log("Database connection successfully!");
            })
            .catch(err => {
                console.log("Database connection error!");
            })
    }
}

module.exports = new Database();
