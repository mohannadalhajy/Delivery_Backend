const { Response } = require("../../helpers/Response.Helper");
const services = require("../../services/Drivers/Auth.Service");
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
      const id = req.payload.user.id
      console.log(id)
      await services.logout(id)
      res.send(new Response(true,{},{}))
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
