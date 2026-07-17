import express from 'express';
const router = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Review from "../models/review.js";
import Listing from "../models/listing.js";
import { isReviewAuthor, validateReview } from '../middleware.js';
import { listingSchema, reviewSchema } from "../schema.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";



//reviews post route
router.post("/", isLoggedIn ,validateReview, wrapAsync(async(req,res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save()
    await listing.save()
    req.flash("success", "new revive created ")
    res.redirect(`/listings/${listing._id}`)
}))

// Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async(req, res) => {
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