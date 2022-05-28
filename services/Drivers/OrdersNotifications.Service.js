const createError = require("http-errors");
const models = require("../../models");
const {
  Response, ErrorResponse,
} = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");
const { getRecordsCountInPage } = require("../../helpers/Constants");
// const validation = async (order, arrayError) => {
// }
const model = models.orders_notifications

module.exports = {
  getAll: async (driverId) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const options = {
            attributes: ['id', 'orderId', 'status'],
            order: [
              ['id', 'DESC']
            ],
            raw: true,
            where: { driverId },
            include: [{
              model: models.orders,
              attributes: ["id", 'startDate', 'amountReceived'],
              include: [{
                model: models.clients,
                attributes: ['companyNameEnglish', 'companyNameArabic']
              }]
            }]
          }
          const result = await model.findAll(options).then(result => {
            if (result.length || result.length === 0) {
              result = result.map(record => {
                // record = record.dataValues
                record.companyNameEnglish = record['order.client.companyNameEnglish']
                record.companyNameArabic = record['order.client.companyNameArabic']
                record.date = record['order.startDate'].toISOString().split('T')[0]
                record.amount = record['order.amountReceived']
                delete record["order.id"]
                delete record["order.amountReceived"]
                delete record["order.client.id"]
                delete record["order.client.companyNameEnglish"]
                delete record["order.client.companyNameArabic"]
                delete record["order.startDate"]
                return record
              })
              return (new Response(true, result, {}))
            }
            else
              return new Response(true, [], {})
            // throw (
            //   createError.NotFound({
            //     error: new Response(false, {}, "There is no notifications"),
            //     code: SERVER_ERRORS.RECORDS_NOT_FOUND,
            //   })
            // )
          }).catch(error => {
            throw (error)
          })
          resolve(result);
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findByPk(id).then(result => {
            if (result) {
              return (new Response(true, result, {}))
            }
            else 
              return (new Response(false, {}, "Notification not found"))
            // throw (
            //   createError.NotFound({
            //     error: new Response(false, {}, "Notification not found"),
            //     code: SERVER_ERRORS.RECORD_NOT_FOUND,
            //   })
            // )
          }).catch(error => {
            throw (error)
          })
          resolve(result);
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  findByOrder: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll({
            where: {
              orderId: id
            }
          }).then(result => {
            return (new Response(true, result, {}))
          }).catch(error => {
            throw (error)
          })
          resolve(result);
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
};