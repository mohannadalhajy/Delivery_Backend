const { getRecordsCountInPage } = require("../helpers/Constants");
const { Response } = require("../helpers/Response.Helper");
const services = require("../services/DriverVehicles.Service");

module.exports = {
  add: async (req, res, next) => {
    try {
      const record = req.body
      const result = await services.add(record)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getDrivers: async (req, res, next) => {
    try {
      let requestedPage = req.query.page;
      let recordsInPage = req.query.take;
      if (requestedPage == null || requestedPage <= 0) requestedPage = 1;
      requestedPage = parseInt(requestedPage)
      if (recordsInPage == null || recordsInPage <= 0) recordsInPage = getRecordsCountInPage();
      recordsInPage = parseInt(recordsInPage)
      const result = await services.getDrivers(requestedPage, recordsInPage)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getVehicles: async (req, res, next) => {
    try {
      let requestedPage = req.query.page;
      let recordsInPage = req.query.take;
      if (requestedPage == null || requestedPage <= 0) requestedPage = 1;
      requestedPage = parseInt(requestedPage)
      if (recordsInPage == null || recordsInPage <= 0) recordsInPage = getRecordsCountInPage();
      recordsInPage = parseInt(recordsInPage)
      const result = await services.getVehicles(requestedPage, recordsInPage)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getTransactions: async (req, res, next) => {
    try {
      let requestedPage = req.query.page;
      let recordsInPage = req.query.take;      
      if (requestedPage == null || requestedPage <= 0) requestedPage = 1;
      requestedPage = parseInt(requestedPage)
      if (recordsInPage == null || recordsInPage <= 0) recordsInPage = getRecordsCountInPage();
      recordsInPage = parseInt(recordsInPage)
      const result = await services.getTransactions(requestedPage, recordsInPage)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  releaseDriver: async (req, res, next) => {
    try {
      const id = req.params.id
      const result = await services.releaseDriver(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  releaseVehicle: async (req, res, next) => {
    try {
      const id = req.params.id
      const result = await services.releaseVehicle(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
