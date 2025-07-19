const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");


const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

// const listEndpoints = require("express-list-endpoints");

const MONGO_URL = "mongodb://127.0.0.1:27017/progress";

main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("hi,i am root");
});

//Listings
app.use("/listings",listings);

//Reviews
app.use("/listings/:id/reviews",reviews);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{message});
});

// app.get("/testListing",async (req,res)=>{
//     let SampleListing = new Listing({
//         "title": "My new villa",
//         "description": "By the beach",
//         price: 1200,
//         location: "Calanguete, Mumbai",
//         country: "India",
//     });
//     await SampleListing.save();
//     console.log("Sample was saved");
//     res.send("successful testing");
// });

// console.log("🔍 Registered endpoints:");
// console.log(listEndpoints(app));

app.listen(8080, () => {
  console.log("server is running on port 8080");
});
