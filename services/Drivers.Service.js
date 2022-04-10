const createError = require("http-errors");
const models = require("../models");
const {
  Response, ErrorResponse,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const Op = require('sequelize').Op;
const bcrypt = require("bcryptjs");
const { Sequelize } = require("../models");
const model = models.drivers
const validation = async (record, arrayError, type) => {
  if (!record) {
    arrayError.push(new ErrorResponse(
      "createDriver",
      "Driver",
      "driver can not be empty.",
      SERVER_ERRORS.RECORD_EMPTY
    ))
    return;
  }
  if (!(record.userName && record.firstName && record.middleName && record.lastName && record.nickName)) {
    arrayError.push(new ErrorResponse(
      "createDriver",
      "userName",
      `userName is empty`,
      SERVER_ERRORS.USER_NAME_EMPTY
    ))
    return;
  }
  if (!(record.civilId)) {
    arrayError.push(new ErrorResponse(
      "createDriver",
      "civilId",
      `civilId is empty`,
      SERVER_ERRORS.CIVIL_ID_EMPTY
    ))
    return;
  }
  const recordCheck = await model.findByPk(record.id).then(result => {
    return result
  }).catch(error => {
    return 0
  })
  if (type === "edit") {
    if (recordCheck) {
      if (recordCheck.civilId !== record.civilId) {
        let count = await model.count({ where: { 'civilId': record.civilId } })
          .then(counter => { return counter }).catch(error => {
            return 0
          })
        if (count) {
          arrayError.push(new ErrorResponse(
            "createDriver",
            "civilId",
            `civilId is exist already`,
            SERVER_ERRORS.CIVIL_ID_IS_EXIST_ALREADY
          ))
          return;
        }
      }
    }
  }
  else {
    let count = await model.count({ where: { 'civilId': record.civilId } })
      .then(counter => { return counter }).catch(error => {
        return 0
      })
    if (count) {
      arrayError.push(new ErrorResponse(
        "createDriver",
        "civilId",
        `userName is exist already`,
        SERVER_ERRORS.CIVIL_ID_IS_EXIST_ALREADY
      ))
      return;
    }
  }

  if (type === "edit") {
    if (recordCheck) {
      if (recordCheck.userName !== record.userName) {
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
      }
    }
  }
  else {
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
  }
  if (type === "edit") {
    if (recordCheck) {
      if (recordCheck.nickName !== record.nickName) {
        let count = await model.count({ where: { 'nickName': record.nickName } })
          .then(counter => { return counter }).catch(error => {
            return 0
          })
        if (count) {
          arrayError.push(new ErrorResponse(
            "createDriver",
            "nickName",
            `nickName is exist already`,
            SERVER_ERRORS.RECORD_IS_EXIST_ALREADY
          ))
          return;
        }
      }
    }
  }
  else {
    let count = await model.count({ where: { 'nickName': record.nickName } })
      .then(counter => { return counter }).catch(error => {
        return 0
      })
    if (count) {
      arrayError.push(new ErrorResponse(
        "createDriver",
        "nickName",
        `nickName is exist already`,
        SERVER_ERRORS.RECORD_IS_EXIST_ALREADY
      ))
      return;
    }
  }
  if (type === 'add' && record.password === undefined)
    arrayError.push(new ErrorResponse(
      "createDriver",
      "password",
      `password is empty`,
      SERVER_ERRORS.PASSWORD_EMPTY
    ))
  const RENumber = /^\d+(\.\d+){0,1}$/
  if (!record.phone)
    arrayError.push(new ErrorResponse(
      "createDriver",
      "phone",
      `Phone is empty`,
      SERVER_ERRORS.PHONE_EMPTY
    ))
  else {
    const result = validationPhone(record.phone)
    if (result) arrayError.push(result)
    if (type === "edit") {
      if (recordCheck) {
        if (recordCheck.phone !== record.phone) {
          let count = await model.count({ where: { 'phone': record.phone } })
            .then(counter => { return counter }).catch(error => {
              return 0
            })
          if (count) {
            arrayError.push(new ErrorResponse(
              "createDriver",
              "phone",
              `phone is exist already`,
              SERVER_ERRORS.PHONE_IS_EXIST_ALREADY
            ))
            return;
          }
        }
      }
    }
    else {
      let count = await model.count({ where: { 'phone': record.phone } })
        .then(counter => { return counter }).catch(error => {
          return 0
        })
      if (count) {
        arrayError.push(new ErrorResponse(
          "createDriver",
          "phone",
          `Phone is exist already`,
          SERVER_ERRORS.PHONE_IS_EXIST_ALREADY
        ))
        return;
      }
    }
  }
}
const validationPhone = (phone) => {
  var phoneno = /^\+971([0-9]{1}|[0-9]{2})[-. ]?([0-9]{3})([-. ]?([0-9]{4}))?$/;
  if (!String(phone).match(phoneno))
    return new ErrorResponse(
      "createDriver",
      phone,
      "phone is not valid.",
      SERVER_ERRORS.PHONE_NOT_VALID
    )
}
const calculateDistanse = (point1, point2) => {
  const a = point1.latitude - point2.latitude;
  const b = point1.longitude - point2.longitude;
  const c = Math.sqrt(a * a + b * b);
  return c
}
module.exports = {
  getAll: async (requestedPage, recordsInPage) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let count = await model.count()
            .then(counter => { return counter }).catch(error => {
              throw (error)
            })
          let pageCount = Math.ceil(count / recordsInPage);
          const result = await model.findAll({
            limit: recordsInPage,
            offset: (requestedPage - 1) * recordsInPage
          }).then(result => {
            //result = result.map(record=>{return {...record,password:"1111"}})
            if (result.length||result.length===0) return (new Response(true, { result, pageCount, count }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no drivers"),
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
  getNames: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll({ attributes: ['id', 'firstName', 'middleName', 'lastName', 'nickName', 'status'] }).then(result => {
            if (result.length||result.length===0) return (new Response(true, { result }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no drivers"),
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
  getBusyNames: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll(
            {
              attributes: ['id', 'firstName', 'middleName', 'lastName', 'nickName'],
              // include: [{
              //   attributes: [],
              //   model: models.drivers  _vehicles,
              //   where: {
              //     endDate: null
              //   }
              // }]
            }
          ).then(result => {
            if (result.length||result.length===0) return (new Response(true, { result }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no drivers"),
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
  getFreeNames: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll(
            {
              attributes: ['id', 'firstName', 'middleName', 'lastName', 'nickName'],
              // include: [{
              //   attributes: ['endDate'],
              //   model: models.drivers_vehicles
              // }]
            }
          ).then(result => {
            // if (result.length) result = result.filter(record => !record.driver_vehicles.some(driver_vehicle => driver_vehicle.endDate == null))
            if (result.length||result.length===0) return (new Response(true, { result }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no drivers"),
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
  deleteAll: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.destroy({ truncate: true }).then(result => {
            return new Response(true, { result, pageCount, count }, {})
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
  deleteGroup: async (ids) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.destroy({
            where: { id: ids }
          })
            .then(result => {
              return new Response(true, { result }, {})
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
                error: new Response(false, {}, "Driver not found"),
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
          const arrayError = []
          await validation(newRecord, arrayError, "edit")
          if (arrayError.length) throw (createError.Conflict({
            arrayError,
            code: SERVER_ERRORS.RECORD_IS_NOT_VALID,
          }))
          const result = await model.update(newRecord, { where: { id } }).then(result => {
            if (result[0]) return (new Response(true, newRecord, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Driver not found"),
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
  add: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const arrayError = []
          await validation(record, arrayError, "add")
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
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findByPk(id, {raw: true}
            // , {
            // include: [
            //     {
            //         model: models.orders,
            //         required: false,
            //         where: {
            //           amountReceived: { [Op.ne]: null },
            //         }}]
                  // }
                  ).then(result => {
            if (result) {
              return (new Response(true, result, {}))
            }
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Driver not found"),
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
  findAppropriateDriver: async (order, blockedDrivers, client) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let result = await model.findAll(
            {
              // attributes: ['id', 'firebaseToken'],
              attributes: ['id', 'firebaseToken', 'latitude', 'longitude', [Sequelize.fn("COUNT", Sequelize.col("orders_notifications.id")), "count"]],
              group: ['drivers.id'],
              where: {
                // firebaseToken: { [Op.ne]: null },
                // id: { [Op.ne]: blockedDrivers },
                // status: 1,
                // transportType: order.transportType
              },
              // having: {
              //   count: 0
              // },
              include: [{
                attributes: [],
                model: models.orders_notifications,
                where: {
                  status: 0
                },
                required: false
              }]
            }
          ).then(result => {
            if (result.length||result.length===0) return result
            else resolve()
          }).catch(error => {
            throw (error)
          })
          //resolve( result );
          const distances = result.map(driver => {
            const distance = calculateDistanse({ latitude: driver.latitude, longitude: driver.longitude }, { latitude: client.latitude, longitude: client.longitude })
            return {driver,distance}
          })
          const shortDistance = distances.reduce((acc, val) => {
            acc[0] = ( acc[0] === undefined || val.distance < acc[0].distance ) ? val : acc[0]
            return acc;
          }, []);
          result = shortDistance[0].driver
          console.log("Driver ID: ", result.id)
          resolve({ firebaseToken: result.firebaseToken, id: result.id });
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
};