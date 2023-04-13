import express from "express";
import { ReviewModel } from "../../database/review";
import passport from "passport";

const Router = express.Router();

/**
 * Route :   /:resId
 * Desc  :   Get all the reviews for a particular restaturant id
 * params:   resId
 * Access:   Public
 * Method:   GET
 */
Router.get("/:resId", async (req, res) => {
    try {
        const { resId } = req.params;
        const reviews = await ReviewModel.find({ restaurants: resId }).sort({
            createdAt: -1
        })
        return res.json({ reviews });
    } catch (error) {
        return res.status(500).json({ error: error.message });
   }
});

/**
 * Route :   /new
 * Desc  :   Add new food/restaurant review and rating
 * params:   none
 * Access:   Private
 * Method:   POST
 */
Router.post("/new", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { _id } = req.user;
        const { reviewData } = req.body;
        const newReview = await ReviewModel.create({ ...reviewData, user: _id });
        return res.json({newReview});
    } catch (error) {
        return res.status(500).json({ error: error.message });
   }
});

/**
 * Route :   /delete/:id
 * Desc  :   Delete a review
 * params:   none
 * Access:   Private
 * Method:   DELETE
 */
Router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { id } = req.user;
        const { user } = req;
        const data = await ReviewModel.findOneAndDelete({
            _id: id,
            user: user._id,
        });
        if (!data) {
            return res.json({ error: "Review was not deleted !!!" });
        }
        return res.status(200).json({ message: "Successfully deleted the review : ", data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
   }
});

export default Router;