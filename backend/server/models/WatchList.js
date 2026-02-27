const mangoose = require('mongoose');

const watchListSchema = new mangoose.Schema({
    userID: {
        type: String,
        required: true  
    },
    movieID: {
        type: String,
        required: true      
    },
    title: {
        type: String,
        required: true      
    },
    poster: {
        type: String,
        required: true      
    }
});

module.exports = mangoose.model('WatchList', watchListSchema);