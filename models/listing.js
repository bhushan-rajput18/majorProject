import mongoose from "mongoose";
const Schema = mongoose.Schema;

import Review from "./review.js";


let listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        url: String,
        filename: String,
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    location: String,

    country: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },

        coordinates: {
            type: [Number],
            required: true,
        }
    }
});


// Delete all reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});


// Creating Model
const Listing = mongoose.model("Listing", listingSchema);

export default Listing;