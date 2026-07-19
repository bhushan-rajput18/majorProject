import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { appendFile } from 'fs';
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import { listingSchema } from "../schema.js";
import listingController from "../controllers/listings.js";
import multer from 'multer';

// Specify the destination folder for uploaded files
const upload = multer({ dest: 'uploads/' });

//index & create route (merged with router.route ..)
router.route("/")
 .get( wrapAsync(listingController.index))
//  .post( validateListing, wrapAsync(listingController.createListing))
 .post( upload.single('listing[image][url]') ,(req, res) => {
    res.send(req.file);
 })


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show , update and create route (merged with route.route...)
router.route("/:id")
 .get( wrapAsync(listingController.showListing))
 .put( isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
 .delete( isLoggedIn, wrapAsync(listingController.destroyListing)
);



//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))


export default router;