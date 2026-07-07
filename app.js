import express from 'express';
import ejsMate from 'ejs-mate';
const app = express();
const port = 8080;
import Listing from "./models/listing.js";
import { fileURLToPath } from 'url';
import path from 'path';
import  methodOverride  from 'method-override';
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import { listingSchema, reviewSchema } from "./schema.js";
import Review from "./models/review.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//connecting mongoose
import mongoose from 'mongoose';

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => { 
        console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
//....................................................

app.get("/", (req, res) => {
    res.send("getting req");
});

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    let errMsg = error.details.map((el) => el.message).join(",");

    if(error) {
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};

//index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
})
);

//new route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
})


//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
    })
);

//create
app.post("/listings", validateListing, wrapAsync(async (req, res) => {

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
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
    })
);

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body || !req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
    })
);

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
})
);

//reviews post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save()
    await listing.save()

    res.redirect(`/listings/${listing._id}`)
}))


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "By the beach ",
//         price: 1500,
//         location: "Calangute goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved ");
//     res.send("testing successful...");

// });

app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something is wrong" } = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log(`app is listening at ${port}`)
})