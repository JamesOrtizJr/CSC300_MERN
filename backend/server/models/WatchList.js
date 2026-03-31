const mongoose = require('mongoose'); 

const watchListSchema = new mongoose.Schema({
    userId: {  
        type: String,
        required: true  
    },
    movieId: {  
        type: String,
        required: true      
    },
    movieTitle: {  
        type: String,
        required: true      
    },
    poster: {
        type: String,
        required: false 
    }
});

// Add index to prevent duplicates
watchListSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('WatchList', watchListSchema);
