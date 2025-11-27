
const utilities = require("../utilities/")
const accountModel = require("../models/account-model") 
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  let message = req.flash("notice")[0] || null; 
  res.render("account/login", {
    title: "Login",
    nav,
    message,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    let messages = [];  

    if (req.flash("success")) {
        messages.push({ text: req.flash("success")[0] });
    }
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(account_password, 10);

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
       `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav, messages: req.flash('notice'),
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      title: "Registration",
      nav, messages: req.flash('notice'),
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  console.log("🔹 Attempting login for email:", account_email);

  const accountData = await accountModel.getAccountByEmail(account_email);
  
  if (!accountData) {
    console.log("No account found for email:", account_email);
    req.flash("notice", "Invalid email or password.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    console.log("Account found:", accountData.account_email);
    const validPassword = await bcrypt.compare(account_password, accountData.account_password);
    
    if (!validPassword) {
      console.log("Password incorrect for email:", account_email);
      req.flash("notice", "Invalid email or password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    console.log("Password correct, generating JWT...");

    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 });

    console.log("JWT generated and stored in cookie!");

    // Clear any previous flash messages
    req.flash("notice", "Login successful!");
    
    return res.redirect("/account/");
  } catch (error) {
    console.error("Login Error:", error.message);
    req.flash("notice", "Something went wrong. Please try again.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}
/* ****************************************
 *  Build Account Management View
 * *************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  let message = req.flash("notice")[0] || null;

  res.render("./account/management", {
    title: "Account Management",
    nav,
    message,
  });
}
/* ****************************************
 *  Process Logout
 * *************************************** */
async function logoutAccount(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

/* ***************************
 *  Deliver Update Account View
 * ************************** */
async function buildAccountUpdateView(req, res) {
  let nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);

  if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/");
  }

  res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      message: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
  });
}
/* ***************************
*  Process Account Update
* ************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
      const updateResult = await accountModel.updateAccountInfo(
          account_id,
          account_firstname,
          account_lastname,
          account_email
      );

      if (updateResult) {
          req.flash("notice", "Your account was successfully updated.");
          return res.redirect("/account/");
      } else {
          req.flash("notice", "Error updating account. Try again.");
          return res.status(500).render("account/update", {
              title: "Update Account",
              nav,
              errors: null,
              account_id,
              account_firstname,
              account_lastname,
              account_email
          });
      }
  } catch (error) {
      console.error("Error updating account:", error);
      req.flash("notice", "Server error. Try again.");
      return res.status(500).render("account/update", {
          title: "Update Account",
          nav,
          errors: null,
          account_id,
          account_firstname,
          account_lastname,
          account_email
      });
  }
}
/* ***************************
*  Process Password Update
* ************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(account_password, 10);
      const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

      if (updateResult) {
          req.flash("notice", "Password successfully updated.");
          return res.redirect("/account/");
      } else {
          req.flash("notice", "Password update failed. Try again.");
          return res.redirect(`/account/update/${account_id}`);
      }
  } catch (error) {
      console.error("Error updating password:", error);
      req.flash("notice", "Server error. Try again.");
      return res.redirect(`/account/update/${account_id}`);
  }
}


module.exports = { buildLogin , buildRegister, registerAccount, accountLogin, buildAccountManagement,logoutAccount,buildAccountUpdateView,updateAccount,updatePassword}