import Listing from "../models/listing.js";
import { listingSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";

const index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
};

const renderNewForm = async(req, res) => {
    res.render("listings/new.ejs")
};

const showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "listing you requested for doesn not exists ")
        return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
    
}


const createListing = async (req, res) => {
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

}

const renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing you requested for doesn not exists ")
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});

}

const updateListing = async (req, res) => {
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id} = req.params;

    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", " Listing updated ")
    res.redirect("/listings");
    
}

const destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted ")
    console.log(deletedListing);
    res.redirect("/listings")

}


export default {index, renderNewForm, showListing,
    createListing, renderEditForm, updateListing,
    destroyListing 
};
