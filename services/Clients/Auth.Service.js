const createError = require("http-errors");
const models = require("../../models");
const {
  Response,
} = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");
const bcrypt = require("bcryptjs");
const { signAccessToken } = require("../../helpers/jwt_helper");

module.exports = {
  login: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await models.clients.findOne({where:{userName:record.userName}}).then(result=>{
            if(!result) throw (
              createError.NotFound({
                error: new Response(false, {}, "Client is not found"),
                code: SERVER_ERRORS.RECORDS_NOT_FOUND,
              })
            )
            return result
          }).catch(error => {
            throw (error)
          })
          const isCorrect = record.password === result.password//await bcrypt.compare(record.password, result.password)
          if(!isCorrect) throw (
            createError.Forbidden({
              error: new Response(false, {}, "User name/Password not valid"),
              code: SERVER_ERRORS.RECORD_NOT_FOUND,
            })
          )
          const client = {"userName": result.userName,"id": result.id}
          const accessToken = await signAccessToken(client)
          resolve(new Response(true, { accessToken, client },{}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  }
};