const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BusSchema = new Schema({
    BusNumber:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    capacity:{
        type: Number,
        required: true,
        min: 1,
    },
    status:{
        type: String,
        enum: ['active','Maintenance', 'inactive'],
        default: 'active',
    },
    assigned_driver_id:{
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        default:null,
    },
    route_id:{
        type: Schema.Types.ObjectId,
        ref: 'Route',
        default:null,
    },
},{timestamps:true})
const Bus = mongoose.model('Bus', BusSchema);
module.exports = Bus;