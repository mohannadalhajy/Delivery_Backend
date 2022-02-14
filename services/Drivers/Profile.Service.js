const createError = require("http-errors");
const models = require("../../models");
const {
  Response,
} = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");
const { deliverOldestOrder } = require("../Orders.Service");

module.exports = {
  profileMe: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const driver = await models.drivers.findByPk(id,{
            attributes:['id','userName', 'status']
          }).then(result => {
            if (result) return result
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Driver not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
          }).catch(error => {
            throw (error)
          })
          resolve(new Response(true, driver, {}));
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
          let record = await models.drivers.findByPk(id).then(result => {
            if (result) return result
          }).catch(error => {
            throw (error)
          })
          record.latitude = body.latitude
          record.longitude = body.longitude
          await record.save()
          record = { "userName": record.userName, "id": record.id }
          resolve(new Response(true, record, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  updateStatus: async (id, status) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let record = await models.drivers.findByPk(id).then(result => {
            if (result) return result
          }).catch(error => {
            throw (error)
          })
          record.status = status
          await record.save()
          if(record.status===1) await deliverOldestOrder(-1)
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
          let record = await models.drivers.findByPk(id).then(result => {
            if (result) return result
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Driver not found"),
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