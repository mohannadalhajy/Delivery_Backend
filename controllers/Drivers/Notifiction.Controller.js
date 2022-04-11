const services = require("../../services/Drivers/OrdersNotifications.Service");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const id = req.payload.user.id;
      const result = await services.getAll(id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
