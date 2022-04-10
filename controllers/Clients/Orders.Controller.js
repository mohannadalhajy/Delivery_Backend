const services = require("../../services/Clients/Orders.Service");
const ordersServices = require("../../services/Orders.Service");
const driversOrdersServices = require("../../services/Drivers/Order.Service");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let requestedPage = req.query.page;
      let recordsInPage = req.query.take;
      const clientId = req.payload.user.id;
      const result = await services.getAll(requestedPage, recordsInPage, clientId)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  add: async (req, res, next) => {
    try {
      const record = req.body
      if (req.payload && req.payload.user) {
        const id = req.payload.user.id;
        record.clientId = id;
      }
      const result = await ordersServices.add(record)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await driversOrdersServices.cancelOrder(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
};
