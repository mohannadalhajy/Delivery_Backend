const { getRecordsCountInPage } = require("../helpers/Constants");
const { Response } = require("../helpers/Response.Helper");
const services = require("../services/Drivers.Service");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let requestedPage = req.query.page;
      let recordsInPage = req.query.take;
      if (requestedPage == null || requestedPage <= 0) requestedPage = 1;
      requestedPage = parseInt(requestedPage)
      if (recordsInPage == null || recordsInPage <= 0) recordsInPage = getRecordsCountInPage();
      recordsInPage = parseInt(recordsInPage)
      const result = await services.getAll(requestedPage, recordsInPage)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getNames: async (req, res, next) => {
    try {
      const result = await services.getNames()
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getBusyNames: async (req, res, next) => {
    try {
      const result = await services.getBusyNames()
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  getFreeNames: async (req, res, next) => {
    try {
      const result = await services.getFreeNames()
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
  },
  getAppropriateDriver: async (req, res, next) => {
    try {
      const result = await services.findAppropriateDriver({transportType:0},[],
        {
          "latitude": 25.422095,
          "longitude": 55.547906,
        })
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  UploadImage: async (req, res, next) => {
    try {
      if (!req.file) throw createError(400, "Bad Image");
      res.send(new Response(true, req.file.filename, {}))
    } catch (error) {
      console.log(error.message);
      if (error.name === "ValidationError")
        return next(createError(422, error.message));
      next(error);
    }
  }
};
