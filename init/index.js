import Listing from "../models/listing.js";
import initData from "./data.js";

// .......
import mongoose from 'mongoose';

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => { 
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6a53cd3021245bb6f7c75a07"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized ...");
};

initDB();