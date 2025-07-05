const Bus = require('../models/BusModel');
const mongoose = require('mongoose');

exports.createBus = async (req, res) => {
    try {
        console.log('  data', req.body);
        const { BusNumber, capacity, status, assigned_driver_id, route_id } = req.body;
        
        // Check if bus already exists
        const existingBus = await Bus.findOne({ BusNumber });
        if (existingBus) {
            return res.status(400).json({ message: 'Bus already exists' });
        }

        // Validate route_id if provided
        let validatedRouteId = null;
        if (route_id && route_id !== 'null' && route_id !== '') {
            if (!mongoose.Types.ObjectId.isValid(route_id)) {
                return res.status(400).json({ message: 'Invalid route_id format' });
            }
            validatedRouteId = route_id;
        }

        // Validate assigned_driver_id if provided
        let validatedDriverId = null;
        if (assigned_driver_id && assigned_driver_id !== 'null' && assigned_driver_id !== '') {
            if (!mongoose.Types.ObjectId.isValid(assigned_driver_id)) {
                return res.status(400).json({ message: 'Invalid assigned_driver_id format' });
            }
            validatedDriverId = assigned_driver_id;
        }

        const bus = new Bus({
            BusNumber,
            capacity,
            status,
            assigned_driver_id: validatedDriverId,
            route_id: validatedRouteId
        });
        
        await bus.save();
        return res.status(201).json(bus);
    } catch (error) {
        console.error('Create Bus Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllBuses = async (req, res) => {
    try {
        console.log('Fetching buses...');
        const buses = await Bus.find()
        // .populate('assigned_driver_id', 'name')
        // .populate('route_id', 'routeName');
        res.status(200).json(buses);
    } catch (error) {
        console.error('Get All Buses Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getBusById = async (req, res) => {
    try {
        const { id } = req.params;
        const buses = await Bus.findById(id)
        // .populate('assigned_driver_id', 'name')
        // .populate('route_id', 'routeName');
        if (!buses)
            return res.status(404).json({ message: 'Bus not found' });
        res.status(200).json(buses);

    } catch (error) {
        console.error('Get Bus by ID Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Validate route_id if provided in updates
        if (updates.route_id && updates.route_id !== 'null' && updates.route_id !== '') {
            if (!mongoose.Types.ObjectId.isValid(updates.route_id)) {
                return res.status(400).json({ message: 'Invalid route_id format' });
            }
        } else if (updates.route_id === 'null' || updates.route_id === '') {
            updates.route_id = null;
        }

        // Validate assigned_driver_id if provided in updates
        if (updates.assigned_driver_id && updates.assigned_driver_id !== 'null' && updates.assigned_driver_id !== '') {
            if (!mongoose.Types.ObjectId.isValid(updates.assigned_driver_id)) {
                return res.status(400).json({ message: 'Invalid assigned_driver_id format' });
            }
        } else if (updates.assigned_driver_id === 'null' || updates.assigned_driver_id === '') {
            updates.assigned_driver_id = null;
        }

        const updateBus = await Bus.findByIdAndUpdate(id, updates, { new: true });
        if (!updateBus)
            return res.status(404).json({ message: 'Bus not found' });
        res.status(200).json(updateBus);
    } catch (error) {
        console.error('Update Bus Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteBus = async (req, res) => {
    try {
        const { id } = req.params;
        const bus = await Bus.findByIdAndDelete(id, { status: "inactive" }, { new: true });
        if (!bus)
            return res.status(404).json({ message: 'Bus not found' });
        res.status(200).json({ message: 'Bus deleted successfully', bus });

    } catch (error) {
        console.error('Delete Bus Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}