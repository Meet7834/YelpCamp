const {campgroundSchema, reviewSchema} = require("./schemas");
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }
    next();
})

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
        // console.log(results);
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user.id)){
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/grounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewID} = req.params;
    const review = await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that");
        return res.redirect(`/grounds/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}