import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { listingSchema, reviewSchema } from "../schema.js";
import Listing from "../models/listing.js";


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
router.get("/new", (req,res) => {
    res.render("listings/new.ejs");
})


//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
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
    await newListing.save();
    res.redirect("/listings");
    })
);


//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
    })
);

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
    })
);

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
})
);

export default router;