/* Route Name: User Comments
 * Author: James Ortiz Jr.
 * Date: 02/26/2026 */

 router.post("/comments", async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).json(comment);
    }

    catch (err) {
        res.status(400).json({error: err.message});
    }
 });