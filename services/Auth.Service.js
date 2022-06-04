const createError = require("http-errors");
const models = require("../models");
const {
  Response,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const bcrypt = require("bcryptjs");
const { signAccessToken } = require("../helpers/jwt_helper");

module.exports = {
  login: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let result = await models.users.findOne({ where: { userName: record.userName },
            raw: true }).then(result => {
            if (!result) throw (
              createError.NotFound({
                error: new Response(false, {}, "User is not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
            return result
          }).catch(error => {
            throw (error)
          })
          const isCorrect = await bcrypt.compare(record.password, result.password)
          if (!isCorrect) throw (
            createError.Forbidden({
              error: new Response(false, {}, "User name/Password not valid"),
              code: SERVER_ERRORS.RECORD_NOT_FOUND,
            })
          )
          if (record.firebaseToken) {
            result.firebaseToken = record.firebaseToken
            console.log("resultresult")
            console.log(result)
            await models.users.update(result, { where: { id: result.id } }).then(newRecord => {
              if (newRecord) return new Response(true, newRecord, {})
              else throw (
                createError.NotFound({
                  error: new Response(false, {}, "error in update firebase"),
                  code: SERVER_ERRORS.RECORD_NOT_FOUND,
                })
              )
            }).catch(error => {
              throw (error)
            })
          }
          const user = { "userName": result.userName, "id": result.id, role: result.role }
          const accessToken = await signAccessToken(user)
          resolve(new Response(true, { accessToken, user }));
        } catch (error) {
          reject(error)
        }
      })()
    })
  }
};