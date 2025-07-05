const express = require("express");
const router = express.Router();
const {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getRoutesByEndPoint,
  getRoutesByCurrentStation,
} = require("../controllers/routeController");
const protect = require("../middlewares/authMiddleware.js");
const authorizeRoles = require("../middlewares/authorizeRoles.js");

// Create
router.post("/", protect, authorizeRoles("Admin"), createRoute);

// Get all
router.get("/", getRoutes);

// Get by ID
router.get("/:id", getRouteById);

// Update
router.put("/:id", protect, authorizeRoles("Admin"), updateRoute);

// Delete
router.delete("/:id", protect, authorizeRoles("Admin"), deleteRoute);

// Get by end_point
router.get("/end-point/:endPoint", getRoutesByEndPoint);

// Get by current_station
router.get("/current-station/:currentStation", getRoutesByCurrentStation);

module.exports = router;
