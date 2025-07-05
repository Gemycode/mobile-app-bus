const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    // type: Number,
    required: true,
    ref: "User",
    validate: {
      validator: async function(value) {
        const User = mongoose.model('User');
        const user = await User.findById(value);
        return user && this.personType === user.role;
      },
      message: 'Person type must match user role'
    }
  },
  personType: {
    type: String,
    enum: ["Student", "Employee"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },
  boardingTime: String,
  deboardingTime: String,
});

module.exports = mongoose.model("Attendance", attendanceSchema);
