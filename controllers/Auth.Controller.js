const { Response } = require("../helpers/Response.Helper");
const services = require("../services/Auth.Service");
module.exports = {
  login: async (req, res, next) => {
    try {
      const record = req.body
      const result = await services.login(record)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      console.log(req.payload.id)
      res.send(new Response(true,{},{}))
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
