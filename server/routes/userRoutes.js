const express = require("express");

const {
  registerController,

} = require("../controllers/userController");

//riouter object
const router = express.Router();

//routes
// REGISTER || POST
router.post("/register", registerController);


//export
module.exports = router;