const createError = require("http-errors");
const models = require("../../models");
const {
  Response,
} = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");
const bcrypt = require("bcryptjs");
const { signAccessToken } = require("../../helpers/jwt_helper");
const { updateStatus } = require("./Profile.Service");

module.exports = {
  login: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await models.drivers.findOne({
            where:
            {
              userName:record.userName
            },
            attributes:['id','userName', 'status', 'password']
          }).then(result=>{
            if(!result) throw (
              createError.NotFound({
                error: new Response(false, {}, "Driver is not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
            return result
          }).catch(error => {
            throw (error)
          })
          const isCorrect = await bcrypt.compare(record.password, result.password)
          if(!isCorrect) throw (
            createError.Forbidden({
              error: new Response(false, {}, "User name/Password not valid"),
              code: SERVER_ERRORS.RECORD_NOT_FOUND,
            })
          )
          console.log(record.firebaseToken)
          result.firebaseToken = record.firebaseToken
          result.status = 1
          await result.save()
          const driver = {"userName": result.userName,"id": result.id, "status": result.status}
          const accessToken = await signAccessToken(driver)
          resolve(new Response(true, { accessToken, driver }));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  logout: async (id) =>{
    return new Promise((resolve, reject)=>{
      (async ()=>{
        try{
          updateStatus(id, 2)
          resolve(new Response(true, { accessToken, driver }));
        } catch(error){
          reject(error)
        }
      })()
    })
  }
};