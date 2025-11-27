const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
/* ***************************
 *  Get inventory Item by ID
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error: " + error);
  }
}


/* ***************************
 *  Add Classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount;
  } catch (error) {
    console.error("Error inserting classification:", error);
    return null;
  }
}

/* ***************************
 *  Add Inventory
 * ************************** */

async function addInventoryItem(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = `
      INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;
    const result = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color]);
    return result.rowCount;
  } catch (error) {
    console.error("Error inserting inventory item:", error);
    return null;
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      UPDATE public.inventory 
      SET inv_make = $1, 
          inv_model = $2, 
          inv_description = $3, 
          inv_image = $4, 
          inv_thumbnail = $5, 
          inv_price = $6, 
          inv_year = $7, 
          inv_miles = $8, 
          inv_color = $9, 
          classification_id = $10 
      WHERE inv_id = $11 
      RETURNING *`;

    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);

    return data.rows[0]; // Return the updated row
  } catch (error) {
    console.error("Model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryById(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data.rowCount // Returns 1 if successful, 0 if unsuccessful
  } catch (error) {
    console.error(" Delete Inventory Error:", error)
    throw new Error("Delete Inventory Error");
  }
}

module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryByInvId ,
  addClassification,
  addInventoryItem,
  updateInventory,
  deleteInventoryById
};