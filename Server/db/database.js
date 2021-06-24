let mongoose = require('mongoose');

const mongodb_url = 'mongodb://localhost:27017/N'
const monggoOnline_url = 'mongodb+srv://admin:admin@maincluster.qoypc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

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
                console.log(err)
            })
    }
}

module.exports = new Database();
