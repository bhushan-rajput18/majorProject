import Listing from "../models/listing.js";
import Review from "../models/review.js";


const createReview = async(req,res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save()
    await listing.save()
    req.flash("success", "new revive created ")
    res.redirect(`/listings/${listing._id}`)
}

const destroyReview = async(req, res) => {
    let { id, reviewId } = req.params;
    await Review.findById(reviewId);
    
    await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Revive deleted")
    res.redirect(`/listings/${id}`);
}

export default { createReview, destroyReview}