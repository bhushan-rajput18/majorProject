import express from 'express';
const router = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Review from "../models/review.js";
import Listing from "../models/listing.js";
import { isReviewAuthor, validateReview } from '../middleware.js';
import { listingSchema, reviewSchema } from "../schema.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import reviewController from "../controllers/reviews.js"


//reviews post route
router.post("/", isLoggedIn ,validateReview, wrapAsync(reviewController.createReview))

// Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

export default router;