const createError = require("http-errors");
const models = require("../models");
const {
  Response,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const { getOrdersNotificationsStatusTypes } = require("../helpers/Constants");
const model = models.orders_notifications
module.exports = {
  add: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          record.status = getOrdersNotificationsStatusTypes()[0]
          const result = await model.create(record).then(result => {
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
  getAll: async (requestedPage, recordsInPage) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll({
            limit: recordsInPage,
            offset: (requestedPage - 1) * recordsInPage
          }).then(result => {
            if (result.length||result.length===0) return (new Response(true, result, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no users"),
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
  delete: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.destroy({ where: { id } }).then(result => {
            if (result) return (new Response(true, result, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "User not found"),
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
  update: async (id, newRecord) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.update(newRecord, { where: { id } }).then(result => {
            if (result[0]) return (new Response(true, newRecord, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "User not found"),
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
  /**throw (
                createError.Conflict({
                  error: new Response(false, {}, "User is already exist"),
                  code: SERVER_ERRORS.USER_IS_ALREADY_EXIST,
                })) */
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findByPk(id).then(result => {
            if (result) return (new Response(true, result, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "User not found"),
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
  }
};