const Route = require('../models/Route');

// createRoute
exports.createRoute = async (req, res) => {
  try {
    const {
      name,
      start_point,
      end_point,
      current_station,
      next_station,
      stops,
      estimated_time
    } = req.body;

    const newRoute = new Route({
      name,
      start_point,
      end_point,
      current_station,
      next_station,
      stops,
      estimated_time
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// getRoutes
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getRouteById
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// updateRoute
exports.updateRoute = async (req, res) => {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRoute) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json(updatedRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// deleteRoute
exports.deleteRoute = async (req, res) => {
  try {
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);
    if (!deletedRoute) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getRoutesByEndPoint
exports.getRoutesByEndPoint = async (req, res) => {
  try {
    const routes = await Route.find({ end_point: req.params.endPoint });
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getRoutesByCurrentStation
exports.getRoutesByCurrentStation = async (req, res) => {
  try {
    const routes = await Route.find({ current_station: req.params.currentStation });
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
