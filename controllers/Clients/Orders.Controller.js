const services = require("../../services/Clients/Orders.Service");
const ordersServices = require("../../services/Orders.Service");
const clientsServices = require("../../services/Clients.Service");
const driversOrdersServices = require("../../services/Drivers/Order.Service");
const createError = require("http-errors");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const clientId = req.payload.user.id;
      const result = await services.getAll(clientId)
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
        // const models = require("../models");
        // const clientsModel = models.clients
      //   let client = await clientsModel.findByPk(id, { raw: true }).then(result => {
      //     if (result) return true//(new Response(true, result, {}))
      //     else throw (
      //       createError.NotFound({
      //         error: new Response(false, {}, "Client not found"),
      //         code: SERVER_ERRORS.RECORD_NOT_FOUND,
      //       })
      //     )
      //   }).catch(error => {
      //     throw (error)
      //   })
      }
      else throw (
        createError.NotFound({
          error: new Response(false, {}, "There is no clients"),
          code: SERVER_ERRORS.RECORDS_NOT_FOUND,
        })
      )
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
