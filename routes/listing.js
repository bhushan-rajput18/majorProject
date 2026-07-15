import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { listingSchema, reviewSchema } from "../schema.js";
import Listing from "../models/listing.js";
import { appendFile } from 'fs';
import { isLoggedIn } from "../middleware.js";


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};

//index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
})
);

//new route
router.get("/new", isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
})


//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
        req.flash("error", "listing you requested for doesn not exists ")
        return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
    })
);

//create
router.post("/", validateListing, wrapAsync(async (req, res) => {

    let result = listingSchema.validate(req.body);
    console.log(result);

    if(result.error){
        throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "new listing created ")
    res.redirect("/listings");
    })
);


//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing you requested for doesn not exists ")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
    })
);

//update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", " Listing updated ")
    res.redirect("/listings");
    })
);

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted ")
    console.log(deletedListing);
    res.redirect("/listings")
})
);

export default router;