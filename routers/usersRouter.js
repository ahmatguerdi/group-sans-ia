const express = require("express");
const router = express.Router();
 const {register,verify} = require("../controllers/userControllers");

 router.post("/register", register);
 router.patch("/verify", verify)

 module.exports = router