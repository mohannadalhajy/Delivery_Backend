const createError = require("http-errors");
const models = require("../models");
const {
  Response,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");

module.exports = {
  profileMe: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user = await models.users.findByPk(id, {attributes:['id','userName']}).then(result => {
            if (result) return result
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "User not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
          }).catch(error => {
            throw (error)
          })
          resolve(new Response(true, user, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  updatePassword: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          resolve("in development");
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  updateEmail: async (id, newRecord) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          resolve("in development");
        } catch (error) {
          reject(error)
        }
      })()
    })
  }
};