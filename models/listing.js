const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: [
      "Urban", 
      "Nature", 
      "Beach", 
      "Luxury",
      "Other"
    ],
    required: true,   
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

ListingSchema.post("findOneAndDelete",async (listing) => {
  if(listing) {
     await Review.deleteMany({_id:{$in : listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
