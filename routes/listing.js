import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { appendFile } from 'fs';
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import { listingSchema } from "../schema.js";
import listingController from "../controllers/listings.js";
import multer from 'multer';
import { storage } from "../cloudConfig.js"

// Specify the destination folder for uploaded files
const upload = multer({ storage });

//index & create route (merged with router.route ..)
router.route("/")
 .get( wrapAsync(listingController.index))
 .post(isLoggedIn, 
   upload.single('listing[image]'),
   validateListing, 
   wrapAsync(listingController.createListing)
)


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show , update and create route (merged with route.route...)
router.route("/:id")
 .get( wrapAsync(listingController.showListing))
 .put( isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
 .delete( isLoggedIn, wrapAsync(listingController.destroyListing)
);



//edit route
router.get("/:id/edit", isLoggedIn, isOwner,
     upload.single('listing[image]'), wrapAsync(listingController.renderEditForm))


export default router;