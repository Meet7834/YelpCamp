const { json } = require('express');
const { func } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: {virtuals: true}};

const CampGroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }, 
        coordinates:{
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

CampGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc.reviews.length) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

CampGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/grounds/${this.id}" style="text-decoration: none; color: #039dfc">${this.title}</a></strong>
    <p>${this.description.substring(0,80)}...</p>
    `
});

module.exports = mongoose.model("Campground", CampGroundSchema);