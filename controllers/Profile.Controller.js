const services = require("../services/Profile.Service");
module.exports = {
  profileMe: async (req, res, next) => {
    try {
      const id = req.payload.user.id;
      const result = await services.profileMe(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      const record = req.body
      const result = await services.updatePassword(record)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },
  updateEmail: async (req, res, next) => {
    try {
      const record = req.body
      const result = await services.updateEmail(record)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
