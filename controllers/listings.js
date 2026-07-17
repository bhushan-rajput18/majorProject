import Listing from "../models/listing.js";

const index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
};

export default {index};
