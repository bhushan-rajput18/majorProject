import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { appendFile } from 'fs';
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import { listingSchema } from "../schema.js";
import listingController from "../controllers/listings.js"


//index Route
router.get("/", wrapAsync(listingController.index) )

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show route
router.get("/:id", wrapAsync(listingController.showListing))

//create
router.post("/", validateListing, wrapAsync(listingController.createListing))


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing))

export default router;