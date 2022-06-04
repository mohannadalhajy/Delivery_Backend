const { getRecordsCountInPage } = require("../helpers/Constants");
const services = require("../services/Users.Service");
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
  getAll: async (req, res, next) => {
    try {
      const result = await services.getAll()
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
