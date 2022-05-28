const createError = require("http-errors");
const models = require("../../models");
const {
  Response,
} = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");

module.exports = {
  profileMe: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const client = await models.clients.findByPk(id,{attributes:['id', 'userName']}).then(result => {
            if (result) return result
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Client not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
          }).catch(error => {
            throw (error)
          })
          resolve(new Response(true, client, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  updateLocation: async (id, body) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let record = await models.clients.findByPk(id).then(result => {
            if (result) return result
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Client not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
          }).catch(error => {
            throw (error)
          })
          record.latitude = body[0].coords.latitude
          record.longitude = body[0].coords.longitude
          await record.save()
          record = { "userName": record.userName, "id": record.id }
          resolve(new Response(true, record, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  updateFirebaseToken: async (id, token) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let record = await models.clients.findByPk(id).then(result => {
            if (result) return result
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Client not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
          }).catch(error => {
            throw (error)
          })
          record.firebaseToken = token
          await record.save()
          record = { "userName": record.userName, "id": record.id }
          resolve(new Response(true, record, {}));
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