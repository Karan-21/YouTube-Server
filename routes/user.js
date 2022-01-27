const express = require("express");
const router = express.Router();

// Controllers
const { getSingleUser, searchUser } = require("../controllers/user");

// Routes
router.post("/user/single", getSingleUser);
router.post("/user/search", searchUser);

module.exports = router;
