const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {

  try{  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
  }catch (error) {
    console.error("❌ Error in buildByClassificationId:", error);
    next(error);
  }
};


/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try{
  const inv_id = parseInt(req.params.inv_id);

  const data = await invModel.getInventoryByInvId(inv_id);
    console.log("📊 Vehicle data:", data ? data.inv_make + " " + data.inv_model : "NOT FOUND");
  
    if (!data) {
    return res.status(404).render("./inventory/error", {
      title: "Vehicle Not Found",
      nav,
      message: "The vehicle you are looking for does not exist.",
    });
  }
    
  let nav = await utilities.getNav();
    console.log("✅ Nav built successfully");
    
  const vehicleName = `${data.inv_make} ${data.inv_model}`;
    console.log("📝 Rendering detail view for:", vehicleName);

  const detailView = utilities.buildVehicleDetail(data);

  res.render("inventory/detail", {
    title: vehicleName,
    nav,
    detailView,
  });
} catch(error){
   console.error("❌ Error in buildByInventoryId:", error);
    next(error);
  }
};
  
module.exports = invCont
