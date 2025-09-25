const express = require("express");
const router = express.Router();
 const {register,verify,login, fortgotPassword, restPassword} = require("../controllers/userControllers");

 router.post("/register", register);
 router.patch("/verify", verify);
 router.post("/login", login);
router.post("/fortgotPassword", fortgotPassword);
router.post("/restPassword",restPassword);


 module.exports = router