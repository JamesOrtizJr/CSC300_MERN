/* Route Name: User Comments
 * Author: James Ortiz Jr.
 * Date: 02/26/2026 */

 const express = require ("express");
 const router = express.Router();
 const Comment = require ("../models/userComment");

 router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
 });

 module.exports = router;