/* Route Name: User Comments
 * Author: James Ortiz Jr.
 * Date: 02/26/2026 */

 router.get("/comments", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
 });