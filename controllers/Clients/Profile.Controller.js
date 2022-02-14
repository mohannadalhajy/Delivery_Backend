const services = require("../../services/Clients/Profile.Service");
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
  updateFirebaseToken: async (req, res, next) => {
    try {
      const id = req.payload.user.id;
      const token = req.body.token
      const result = await services.updateFirebaseToken(id, token)
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
  },
  updateLocation: async (req, res, next) => {
    try {
      const id = req.payload.user.id;
      const body = req.body
      const result = await services.updateLocation(id, body)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
