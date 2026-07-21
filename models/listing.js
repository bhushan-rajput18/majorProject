import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Review from "./review.js";


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
//.......................

let listingSchema = new Schema ({
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
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],

    owner: {
        type:Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
        type: {
            type: String, //Dont do `{ location: { type: String }`
            enum: ['Point'],  //`location.type must be point`
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

//creating model with one line
const Listing = mongoose.model("Listing", listingSchema);
export default Listing;