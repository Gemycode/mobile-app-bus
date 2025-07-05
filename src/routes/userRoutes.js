const express = require("express");
const uploadImg = require("../middlewares/upload.js");
const protect = require("../middlewares/authMiddleware.js");
const authorizeRoles = require("../middlewares/authorizeRoles.js")
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getStudentsByParent,
  getStudentWithParent,
  updateUser,
  uploadProfileImage,
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
  changePassword,
} = require("../controllers/userController");

// register new user
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get All users
router.get("/", protect, authorizeRoles("Admin"), getAllUsers);

// Get user by Id
router.get("/:id",protect, authorizeRoles("Admin" ,'Parent'), getUserById);

// one parent his students
router.get("/parent/:parentId/students", getStudentsByParent);

// get student with his parents data
router.get("/student/:id/with-parent", getStudentWithParent);
// update user one field or two fiels
router.patch(
  "/:id",
  protect,
  // authorizeRoles("Admin", "Parent", "Student"),
  updateUser
);
// delete user using id by admin
router.delete("/:id", protect, authorizeRoles("Admin"), deleteUser);
// upload image
router.patch(
  "/upload-profile-image",
  protect,
  uploadImg.single("image"),
  uploadProfileImage
);
// Get current user profile
router.get('/me', protect, getCurrentUser);
// Update current user profile
router.patch('/me', protect, updateCurrentUser);
// Change password
router.patch('/change-password', protect, changePassword);

module.exports = router;
