const express = require("express");
const protect = require("../middleware/authMiddleware");
const { updateProfile } = require("../controllers/userController");
const { updatePassword } = require("../controllers/changePassword.js");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User profile",
    user: req.user
  });
});

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, updatePassword);

module.exports = router;