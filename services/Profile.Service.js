const createError = require("http-errors");
const models = require("../models");
const {
  Response,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const bcrypt = require("bcryptjs");

module.exports = {
  profileMe: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const user = await models.users.findByPk(id, { attributes: ['id', 'userName', 'role'] }).then(result => {
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
  updatePassword: async (id, record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const { oldPassword, newPassword } = record;
          const user = await models.users.findByPk(id).then(result => {
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
          
          if (!user) {
            throw createError.NotFound({
              array_error: [
                new ErrorResponse("payload", "userId", "User not registered"),
              ],
              code: SERVER_ERRORS.USER_NOT_REGISTERED,
            });
          }

          // check if old password is correct
          const isMatch = await bcrypt.compare(oldPassword, user.password);
          if (!isMatch) {
            throw createError.BadRequest({
              array_error: [
                new ErrorResponse(
                  "body",
                  "password",
                  "old password is not correct"
                ),
              ],
              code: SERVER_ERRORS.OLD_PASSWORD_IS_NOT_CORRECT,
            });
          }

          // const hPassword = await user.hashedPassword(newPassword);
          const salt = await bcrypt.genSalt(10)
          const hashPassword = await bcrypt.hash(newPassword, salt);
          user.password = hashPassword;
          console.log(user)
          console.log(id)
          const result = await models.users.update(user, { where: { id } }).then(result => {
            if (result[0]) return (new Response(true, user, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "User not found."+result),
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