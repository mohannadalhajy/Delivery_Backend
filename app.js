const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require('path');
const compression = require('compression')
const app = express();
require('./models/index.js') 
const clientsRoute = require('./routes/Clients.Router')
const ordersRoute = require('./routes/Orders.Router')
const usersRoute = require('./routes/Users.Router')
const authRoute = require('./routes/Auth.Router')
const profileRoute = require('./routes/Profile.Route')
const driversRoute = require('./routes/Drivers.Route')
require("./firebase/initFirebase");
const vehiclesRoute = require('./routes/Vehicles.Router')
const driverVehiclesRoute = require('./routes/DriverVehicles.Router')
const driversAuthRoute = require('./routes/Drivers/Auth.Router')
const clientsAuthRoute = require('./routes/Clients/Auth.Router')
const clientsOrdersRoute = require('./routes/Clients/Orders.Router')
const clientscustomersRoute = require('./routes/Customers.Router')
const driverProfileRoute = require('./routes/Drivers/Profile.Route')
const clientProfileRoute = require('./routes/Clients/Profile.Route')
const driverOrdersRoute = require('./routes/Drivers/Orders.Router')
const driverNotificationsRoute = require('./routes/Drivers/Notifications.Router')
const fs = require('fs');
const dir1 = './ClientsImages';
if (!fs.existsSync(dir1)) {
  fs.mkdirSync(dir1);
}
const dir2 = './DriversImages';
if (!fs.existsSync(dir2)) {
  fs.mkdirSync(dir2);
}
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression())
app.use(function (req, res, next) {
  let allowedOrigins = ["http://localhost:3000"]
  let origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use('/clientsImages', express.static('ClientsImages'));
app.use('/driversImages', express.static('DriversImages'));
app.use('/clients',clientsRoute)
app.use('/orders',ordersRoute)
app.use('/drivers',driversRoute)
app.use('/driverVehicles',driverVehiclesRoute)
app.use('/users',usersRoute)
app.use('/vehicles',vehiclesRoute)
app.use('/auth',authRoute)
app.use('/driversAuth',driversAuthRoute)
app.use('/clientsAuth',clientsAuthRoute)
app.use('/clientsOrders',clientsOrdersRoute)
app.use('/clientsCustomers',clientscustomersRoute)
app.use('/profile',profileRoute)
app.use('/driverProfile',driverProfileRoute)
app.use('/clientProfile',clientProfileRoute)
app.use('/driverOrders',driverOrdersRoute)
app.use('/driverNotifications',driverNotificationsRoute)
app.use(express.static(path.join(__dirname, "./build")))
app.use(express.static(path.join(__dirname, "./buildTalabat")))
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"))
});


app.use(async (req, res, next) => {
  next(createError.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  }); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
