import express from 'express';
import ejsMate from 'ejs-mate';
const app = express();
const port = 8080;
import Listing from "./models/listing.js";
import { fileURLToPath } from 'url';
import path from 'path';
import  methodOverride  from 'method-override';

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

//index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" ,{allListings});
});

//new route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
})


//show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//create
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//update route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
});


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


app.listen(8080, () => {
    console.log(`app is listening at ${port}`)
})