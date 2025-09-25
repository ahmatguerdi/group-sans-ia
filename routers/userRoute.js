const express = require("express");
const {login, fortgotPassword, restPassword}= require("../controllers/userController");
const router = express.Router();

router.post("/login", login);
router.post("/fortgotPassword", fortgotPassword);
router.post("/restPassword",restPassword);

module.exports = router;