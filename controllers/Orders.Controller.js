const { getRecordsCountInPage } = require("../helpers/Constants");
const { Response } = require("../helpers/Response.Helper");
const services = require("../services/Orders.Service");

module.exports = {
  getAllDaily: async (req, res, next) => {
    try {
      const result = await services.getAllDaily()
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      let requestedPage = req.query.page;
      let recordsInPage = req.query.take;
      let type = req.query.type;
      if (requestedPage == null || requestedPage <= 0) requestedPage = 1;
      requestedPage = parseInt(requestedPage)
      if (recordsInPage == null || recordsInPage <= 0) recordsInPage = getRecordsCountInPage();
      recordsInPage = parseInt(recordsInPage)
      const result = await services.getAll(requestedPage, recordsInPage, type)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await services.delete(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  deleteAll: async (req, res, next) => {
    try {
      const result = await services.deleteAll()
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  deleteGroup: async (req, res, next) => {
    try {
      const result = await services.deleteGroup(req.body)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const id = req.params.id;
      const newRecord = req.body
      const result = await services.update(id, newRecord)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  updateDriver: async (req, res, next) => {
    try {
      const id = req.params.id;
      const newRecord = req.body
      const result = await services.updateDriver(id, newRecord)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
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
  findById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await services.findById(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
