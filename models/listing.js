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
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                : v,
        },
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
    }]
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

//creating model with one line
const Listing = mongoose.model("Listing", listingSchema);
export default Listing;