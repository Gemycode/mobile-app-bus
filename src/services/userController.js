const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const protect = require("../middlewares/authMiddleware.js");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// New user registration
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, parentId, image, phone, licenseNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already in use" });

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      parentId,
      profileImage: image,
      phone,
      licenseNumber,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        parentId: newUser.parentId,
        image: newUser.profileImage,
      },
      token,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// sign in
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        parentId: user.parentId,
        image: user.profileImage,
      },
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// get one user by Id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// get all student under same parent
const getStudentsByParent = async (req, res) => {
  try {
    const parentId = req.params.parentId;

    const students = await User.find({ role: "student", parentId });

    res.json(students);
  } catch (error) {
    console.error("GET STUDENTS BY PARENT ERROR:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
// get student with his parent data
const getStudentWithParent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).populate("parentId");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("GET STUDENT WITH PARENT ERROR:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
//   PATCH or Update
const updateUser = async (req, res) => {
    try {
      const { name, email, password, role, parentId } = req.body;
  
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // تحديث فقط الحقول اللي اتبعتت
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (password !== undefined) user.password = password;
      if (role !== undefined) user.role = role;
      if (parentId !== undefined) user.parentId = parentId;
  
      const updatedUser = await user.save();
  
      res.json({
        message: 'User updated successfully',
        user: updatedUser,
      });
    } catch (err) {
      console.error("UPDATE USER ERROR:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  // Delete User
const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error("DELETE USER ERROR:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
// upload Avatar
const uploadProfileImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
  
    user.profileImage = req.file.path; 
    await user.save();
  
    res.json({ message: "Profile image uploaded", image: user.profileImage });
  });
  
// Get current user profile
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Update current user profile
const updateCurrentUser = asyncHandler(async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('UPDATE PROFILE ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password changed successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getStudentsByParent,
  getStudentWithParent,
  updateUser,
  deleteUser,
  uploadProfileImage,
  getCurrentUser,
  updateCurrentUser,
  changePassword
};
