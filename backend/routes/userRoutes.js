const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserDetails, updatePassword } = require("../controller/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserDetails);
router.put("/update-password", authMiddleware, updatePassword);
router.get("/", (req, res) => {
  res.json({ message: "User test route" });
});
module.exports = router;
