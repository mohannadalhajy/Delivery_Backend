const createError = require("http-errors");
const models = require("../models");
const {
  Response,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const bcrypt = require("bcryptjs");

module.exports = {
  add: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await models.users.findOne({where:{userName:record.userName}}).then(result=>{
            if(result) throw (
              createError.Conflict({
                error: new Response(false, {}, "User is already exist"),
                code: SERVER_ERRORS.USER_IS_ALREADY_EXIST,
              })
            )
          }).catch(error => {
            throw (error)
          })
          const salt = await bcrypt.genSalt(10)
          const hashPassword = await bcrypt.hash(record.password, salt);
          record.password = hashPassword
          const result = await models.users.create(record).then(result => {
            return (new Response(true, {id:result.id, userName:result.userName}, {}))
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
  getAll: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await models.users.findAll({}).then(result => {
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
          const result = await models.users.destroy({ where: { id } }).then(result => {
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
          const result = await models.users.update(newRecord, { where: { id } }).then(result => {
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
  add: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          await models.users.findOne({where:{userName:record.userName}}).then(result=>{
            if(result) throw (
              createError.Conflict({
                error: new Response(false, {}, "User is already exist"),
                code: SERVER_ERRORS.USER_IS_ALREADY_EXIST,
              })
            )
          }).catch(error => {
            throw (error)
          })
          const salt = await bcrypt.genSalt(10)
          const hashPassword = await bcrypt.hash(record.password, salt);
          record.password = hashPassword
          const result = await models.users.create(record).then(result => {
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
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await models.users.findByPk(id).then(result => {
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