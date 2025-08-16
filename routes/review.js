const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  reviewSchema,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

//post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(ReviewController.createReview)
);

//delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewController.destroyReview)
);

module.exports = router;
