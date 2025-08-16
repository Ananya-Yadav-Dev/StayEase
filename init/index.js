const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
if (process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const MONGO_URL = process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

main();

const initDB = async () => {
  await Listing.deleteMany({});
  const modifiedData = initData.data.map((obj)=>({...obj,owner:"68a05efcd0c3af66d676103f"}));
  await Listing.insertMany(modifiedData);
  console.log("Data was initialized");
};

initDB();
