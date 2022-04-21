const createError = require("http-errors");
const models = require("../../models");
const {
  Response,
} = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");
const bcrypt = require("bcryptjs");
const { signAccessToken } = require("../../helpers/jwt_helper");
const { updateStatus } = require("./Profile.Service");
const model = models.drivers
const validation = async (record, arrayError) => {
  if (!record) {
    arrayError.push(new ErrorResponse(
      "createDriver",
      "Driver",
      "driver can not be empty.",
      SERVER_ERRORS.RECORD_EMPTY
    ))
    return;
  }
  if (!(record.userName)) {
    arrayError.push(new ErrorResponse(
      "createDriver",
      "userName",
      `userName is empty`,
      SERVER_ERRORS.USER_NAME_EMPTY
    ))
    return;
  }

    let count = await model.count({ where: { 'userName': record.userName } })
      .then(counter => { return counter }).catch(error => {
        return 0
      })
    if (count) {
      arrayError.push(new ErrorResponse(
        "createDriver",
        "userName",
        `userName is exist already`,
        SERVER_ERRORS.RECORD_IS_EXIST_ALREADY
      ))
      return;
    }
  if (record.password === undefined)
    arrayError.push(new ErrorResponse(
      "createDriver",
      "password",
      `password is empty`,
      SERVER_ERRORS.PASSWORD_EMPTY
    ))
}
module.exports = {
  login: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findOne({
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
  register : async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const arrayError = []
          await validation(record, arrayError)
          if (arrayError.length) throw (createError.Conflict({
            arrayError,
            code: SERVER_ERRORS.RECORD_IS_NOT_VALID,
          }))
          const salt = await bcrypt.genSalt(10)
          const hashPassword = await bcrypt.hash(record.password, salt);
          record.password = hashPassword
          record.status = 1
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
  logout: async (id) =>{
    return new Promise((resolve, reject)=>{
      (async ()=>{
        try{
          updateStatus(id, 2, true)
          resolve(new Response(true, {}));
        } catch(error){
          reject(error)
        }
      })()
    })
  }
};