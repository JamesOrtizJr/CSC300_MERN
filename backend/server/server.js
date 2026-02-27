const express = require("express");
const app = express();
const cors = require('cors')
const loginRoute = require('./routes/userLogin')
const getAllUsersRoute = require('./routes/userGetAllUsers')
const registerRoute = require('./routes/userSignUp')
const getUserByIdRoute = require('./routes/userGetUserById')
const dbConnection = require('./config/db.config')
const editUser = require('./routes/userEditUser')
const deleteUser = require('./routes/userDeleteAll')

const makeCommentRoute = require ('./routes/userComments/userMakeComment');
const getAllCommentsRoute = require('./routes/userComments/userGetAllUserComments'); 
//REVIEW
//const getReviewsRoute = require('./routes/getReviews');
//const postReviewRoute = require('./routes/postReview');

require('dotenv').config();
const SERVER_PORT = 8081
// butt
dbConnection()
app.use(cors({origin: '*'}))
app.use(express.json())
app.use('/user', loginRoute)
app.use('/user', registerRoute)
app.use('/user', getAllUsersRoute)
app.use('/user', getUserByIdRoute)
app.use('/user', editUser)
app.use('/user', deleteUser)

app.use ('/userMakeComment', makeCommentRoute);
app.use ('/userGetAllUserComments', getAllCommentsRoute);

//REVIEW
//app.use('/reviews', getReviewsRoute);
//app.use('/reviews', postReviewRoute);

/*
app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
}) */

/* I'm using this code to run a test program.
 * ChatGPT says it stops the server from running twice during tests.
 */
if (process.env.NODE_ENV !== "test") {
    app.listen(SERVER_PORT, () => {
      console.log(`The backend service is running on port ${SERVER_PORT}`);
    });
  }
  
  module.exports = app;