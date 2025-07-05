const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const userRoutes = require('./routes/userRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const busRoutes = require('./routes/bus.routes');
const notification = require('./routes/notificationsRoutes')
const routeRoutes = require('./routes/routeRoutes');
const attendanceRoutes = require("./routes/attendance.routes");


dotenv.config();
connectDB();
const app = express();
app.use(cors());

app.use(express.json());


// users Route
app.use('/api/users', userRoutes);
// tracking Routes
app.use('/api/trackingRoutes',trackingRoutes)
// Route Route
app.use('/api/routes', routeRoutes);
// busRoutes
app.use('/api/buses', busRoutes);
// attendance Routes
app.use("/api/attendances", attendanceRoutes);
// Notification Routes
app.use("/api/notification", notification);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
