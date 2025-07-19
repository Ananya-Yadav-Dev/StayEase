const express = require('express');
const router  = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");

const validateReview  = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error);
  }else{
    next();
  }
}

//post route
router.post("/", validateReview , wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(newReview);
    res.send("Review Saved");
    // res.redirect(`/listings/${req.params.id}`);
}));

//delete route
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
  let { id,reviewId } = req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
  await Review.findById(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;