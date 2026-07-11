import express from 'express';
const router = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { reviewSchema } from "../schema.js";
import Review from "../models/review.js";
import Listing from "../models/listing.js";

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};

//reviews post route
router.post("/", validateReview, wrapAsync(async(req,res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save()
    await listing.save()
    req.flash("success", "new revive created ")
    res.redirect(`/listings/${listing._id}`)
}))

// Delete review
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Review.findById(reviewId);
    
    await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Revive deleted")
    res.redirect(`/listings/${id}`);
}))

export default router;