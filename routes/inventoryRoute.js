// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId",utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:inv_id",utilities.handleErrors(invController.buildByInvId)) ;
router.get("/", utilities.handleErrors(invController.showManagementView))

router.get("/add-classification", utilities.handleErrors(invController.showAddClassificationForm));
router.post("/add-classification", utilities.handleErrors(invController.processAddClassification));

router.get("/add-inventory", utilities.handleErrors(invController.showAddInventoryForm));
router.post("/add-inventory", utilities.handleErrors (invController.processAddInventory));

// Route to get inventory items as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//Route to Edit Inventory Item
router.get("/edit/:inv_id",utilities.checkLogin,  utilities.handleErrors(invController.editInventoryView));
//Route to Update Inventory Item
router.post(
    "/update",
    utilities.checkLogin,
    utilities.newInventoryRules(), 
    utilities.checkUpdateData, 
    utilities.handleErrors(invController.updateInventory)
);

module.exports = router;
