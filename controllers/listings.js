import Listing from "../models/listing.js";
import { listingSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";

import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken })

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


const createListing = async (req, res, next ) => {

    let response = await geocodingClient.forwardGeocode ({
        query: req.body.listing.location,
        limit: 1
    }).send();

    
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, ".." , filename)

    let result = listingSchema.validate(req.body);
    console.log(result);

    if(result.error){
        throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
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

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250,c_fill")
    res.render("listings/edit.ejs", {listing, originalImageUrl});

}

const updateListing = async (req, res) => {

    console.log(req.body);
    console.log(req.file);

    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id} = req.params;

    // Always update text fields
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if(typeof req.file !== "undefined") {


        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();

    }
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
