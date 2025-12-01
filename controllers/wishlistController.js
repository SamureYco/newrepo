const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

/* ***************************
 * View Wishlist Page
 * ************************** */
async function viewWishlist(req, res) {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    
    try {
        const wishlistItems = await accountModel.getWishlist(account_id);
        res.render("account/wishlist", {
            title: "My Wishlist",
            nav,
            wishlistItems,
            message: req.flash("notice"),
        });
    } catch (error) {
        console.error("Error retrieving wishlist:", error);
        req.flash("notice", "Error loading wishlist.");
        res.redirect("/account/");
    }
}

/* ***************************
 * Add Vehicle to Wishlist
 * ************************** */
async function addToWishlist(req, res) {
    const account_id = res.locals.accountData.account_id;
    const inv_id = req.body.inv_id;

    try {
        const result = await accountModel.addToWishlist(account_id, inv_id);
        if (result) {
            req.flash("notice", "Vehicle added to your wishlist!");
        } else {
            req.flash("notice", "Vehicle is already in your wishlist.");
        }
        res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        req.flash("notice", "Error adding vehicle to wishlist.");
        res.redirect(`/inv/detail/${inv_id}`);
    }
}

/* ***************************
 * Remove Vehicle from Wishlist
 * ************************** */
async function removeFromWishlist(req, res) {
    const account_id = res.locals.accountData.account_id;
    const inv_id = req.body.inv_id;

    try {
        const result = await accountModel.removeFromWishlist(account_id, inv_id);
        if (result) {
            req.flash("notice", "Vehicle removed from your wishlist.");
        } else {
            req.flash("notice", "Vehicle not found in your wishlist.");
        }
        res.redirect(`/inv/detail/${inv_id}`);
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        req.flash("notice", "Error removing vehicle from wishlist.");
        res.redirect(`/inv/detail/${inv_id}`);
    }
}

module.exports = { viewWishlist, addToWishlist, removeFromWishlist };