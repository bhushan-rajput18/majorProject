import Listing from "../models/listing.js";
import initData from "./data.js";

// .......
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

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6a53cd3021245bb6f7c75a07"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized ...");
};

initDB();