const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "No listing found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.listingsByCategory = async (req, res, next) => {
  try {
    const allowedCategories = ["Urban", "Nature", "Beach", "Luxury", "Other"];
    const { category } = req.params;
    // Validate category
    if (!allowedCategories.includes(category)) {
      req.flash("error", "Invalid category");
      return res.redirect("/listings");
    }
    const listings = await Listing.find({ category });
    res.render("listings/category.ejs", { listings, category });
  } catch (err) {
    next(err);
  }
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  const filename = req.file.filename; 
  // console.log(url,"..",filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  // console.log(newListing);
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "No listing found");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file!="undefined"){
  let url = req.file.path;
  let filename = req.file.path;
  listing.image = {url,filename};
  await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
