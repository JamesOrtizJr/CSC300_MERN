/* Model Name: User Comments
 * Author: James Ortiz Jr.
 * Date: 02/26/2026 */

const mongoose = require("mongoose");

// user schema/model
const newUserCommentSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    }, 

    postId: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true
    },
    /* This initializes string variables in order
     * for a comment to be made. */

    createdAt: {
        type: Date,
        default: Date.now
    }
    // {collection: "comments"}

}); // This marks the end of the Schema for new user comments.

module.exports = mongoose.model("Comment", newUserCommentSchema);