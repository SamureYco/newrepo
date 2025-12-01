const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const accountValidate = require("../utilities/account-validation");
const wishlistController = require("../controllers/wishlistController");

// Default account route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));


// Route to display login page
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get( "/register",utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
// Logout Route
router.get("/logout", utilities.handleErrors(accountController.logoutAccount));

// Route to display update account view
router.get(
  "/update/:account_id",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountUpdateView)
);
// Route to process account update (First Name, Last Name, Email)
router.post(
  "/update-info",
  accountValidate.updateAccountRules(), 
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);
// Route to process password update
router.post(
  "/update-password",
  accountValidate.passwordRules(), 
  accountValidate.checkPasswordUpdate,
  utilities.handleErrors(accountController.updatePassword)
);

// Wishlist Routes
router.get("/wishlist", utilities.checkLogin, utilities.handleErrors(wishlistController.viewWishlist));
router.post("/wishlist/add", utilities.checkLogin, utilities.handleErrors(wishlistController.addToWishlist));
router.post("/wishlist/remove", utilities.checkLogin, utilities.handleErrors(wishlistController.removeFromWishlist));



module.exports = router
