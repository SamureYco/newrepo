const pool = require("../database/")
/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}
/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
/* ***************************
 *  Get Account By ID
 * ************************** */
async function getAccountById(account_id) {
  try {
      const sql = "SELECT * FROM account WHERE account_id = $1";
      const result = await pool.query(sql, [account_id]);
      return result.rows[0];
  } catch (error) {
      console.error("Error retrieving account by ID:", error);
      return null;
  }
}
/* ***************************
*  Update Account Information
* ************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  try {
      const sql = `
          UPDATE account 
          SET account_firstname = $1, account_lastname = $2, account_email = $3 
          WHERE account_id = $4 RETURNING *`;
      const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
      return data.rows[0];
  } catch (error) {
      console.error("Error updating account:", error);
      return null;
  }
}

/* ***************************
*  Update Password
* ************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
      const sql = `UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *`;
      const result = await pool.query(sql, [hashedPassword, account_id]);
      return result.rowCount;
  } catch (error) {
      console.error("Password update error:", error);
      return null;
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



module.exports = { registerAccount, getAccountById,getAccountByEmail,addClassification,addInventoryItem,updateAccountInfo,updatePassword }