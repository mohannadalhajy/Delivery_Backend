const createError = require("http-errors");
const models = require("../../models");
const {
  Response, ErrorResponse,
} = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");
// const validation = async (order, arrayError) => {
// }
const model = models.orders_notifications

module.exports = {
  getAll: async (requestedPage, recordsInPage, driverId) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let count = await model.count({ where: { driverId } })
            .then(counter => { return counter }).catch(error => {
              throw (error)
            })
          let pageCount = Math.ceil(count / recordsInPage);
          const result = await model.findAll({
            attributes: ['id', 'orderId', 'status'],
            order: [
              ['id', 'DESC']
            ],
            where: { driverId },
            limit: recordsInPage,
            offset: (requestedPage - 1) * recordsInPage
          }).then(result => {
            if (result.length || result.length === 0) {
              return (new Response(true, { result, count, pageCount }, {}))
            }
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no notifications"),
                code: SERVER_ERRORS.RECORDS_NOT_FOUND,
              })
            )
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
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Notification not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
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
            where:{
              orderId:id
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