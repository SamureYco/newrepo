const express = require("express");
const router = express.Router();

router.get("/trigger-error", (req, res, next) => {
  // Genera un error intencional
  const error = new Error("This is an intentional 500 error for testing!");
  error.status = 500;
  next(error);
});

module.exports = router;