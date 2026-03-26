const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: {
            filename: String,
            url: String,
        },
        default: {
            filename: "listingimage",
            url: "https://unsplash.com/photos/a-modern-bathroom-with-double-sinks-and-a-bathtub-YDc_S7uIYic",
        },
        set: (v) => {
            // if caller passes an empty string or null, fall back to default object
            if (!v || (typeof v === "string" && v === "")) {
                return {
                    filename: "listingimage",
                    url: "https://unsplash.com/photos/a-modern-bathroom-with-double-sinks-and-a-bathtub-YDc_S7uIYic",
                };
            }
            // if they supply a string assume it's the url only
            if (typeof v === "string") {
                return { filename: "listingimage", url: v };
            }
            return v; // expect object with filename/url
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
            {
            type : Schema.Types.ObjectId,
            ref : "Reviews",
        },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews }});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;