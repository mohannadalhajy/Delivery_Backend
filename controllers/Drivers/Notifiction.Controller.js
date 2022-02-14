const { getRecordsCountInPage } = require("../../helpers/Constants");
const services = require("../../services/Drivers/OrdersNotifications.Service");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const id = req.payload.user.id;
      let requestedPage = req.query.page;
      let recordsInPage = req.query.take;
      if (requestedPage == null || requestedPage <= 0) requestedPage = 1;
      requestedPage = parseInt(requestedPage)
      if (recordsInPage == null || recordsInPage <= 0) recordsInPage = getRecordsCountInPage();
      recordsInPage = parseInt(recordsInPage)
      const result = await services.getAll(requestedPage, recordsInPage, id)
      res.send(result)
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
};
