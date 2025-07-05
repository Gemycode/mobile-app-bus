const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  start_point: {
    type: String,
    required: true
  },
  end_point: {
    type: String,
    required: true
  },
  stops: {
    type: [String], 
    required: true
  },
  estimated_time: {
    type: String, 
    required: true
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Route', routeSchema);