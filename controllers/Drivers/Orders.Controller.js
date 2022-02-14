const services = require("../../services/Drivers/Order.Service");
const ordersServices = require("../../services/Orders.Service");

module.exports = {
  findById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await services.findById(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  acceptOrder: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await services.acceptOrder(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  pickUpOrder: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await services.pickUpOrder(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  deliverOrder: async (req, res, next) => {
    try {
      const record = req.body
      const result = await services.deliverOrder(record)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  failedOrder: async (req, res, next) => {
    try {
      const result = await services.failedOrder(req.body)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  rejectOrder: async (req, res, next) => {
    try {
      const result = await services.rejectOrder(req.body)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  editOrder: async (req, res, next) => {
    try {
      const result = await services.editOrder(req.body)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
