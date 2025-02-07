const express = require("express");

const {
  registerController,
  loginController,
  updateUserControll, // Corrected function name
} = require("../controllers/userController");

//router object
const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registerController);

//Login || POST
router.post("/login", loginController);

// Update User || POST
router.put("/update-user", updateUserControll);

//export
module.exports = router;