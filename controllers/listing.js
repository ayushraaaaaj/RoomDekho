const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author",}, }).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    // attach the logged-in user as the owner before saving
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created successfully");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let updates = {...req.body.listing};

    // Convert image URL string to the expected embedded object on update.
    if (typeof updates.image === "string") {
        updates.image = {
            filename: "listingimage",
            url: updates.image,
        };
    }

    await Listing.findByIdAndUpdate(id, updates, {
        returnDocument: 'after',
        runValidators: true,
        context: "query",
    });
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}