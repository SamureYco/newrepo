const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")


// Route to display login page
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get( "/register",utilities.handleErrors(accountController.buildRegister))

module.exports = router
