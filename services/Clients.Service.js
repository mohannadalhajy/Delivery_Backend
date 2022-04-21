const createError = require("http-errors");
const models = require("../models");
const {
  Response, ErrorResponse,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const { getEmirates } = require("../helpers/Constants");
const model = models.clients
const modelCharges = models.charges
const modelOrders = models.orders
const modelClientsAccounts = models.clients_accounts
const bcrypt = require("bcryptjs");
const { sequelize } = require("../models");
const validation = async (record, arrayError, type) => {
  if (!record) {
    arrayError.push(new ErrorResponse(
      "createClient",
      "Client",
      "client can not be empty.",
      SERVER_ERRORS.RECORD_EMPTY
    ))
    return;
  }
  if (!record.userName) {
    arrayError.push(new ErrorResponse(
      "createClient",
      "userName",
      `userName is empty`,
      SERVER_ERRORS.USER_NAME_EMPTY
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
      if (recordCheck.userName !== record.userName) {
        let count = await model.count({ where: { 'userName': record.userName } })
          .then(counter => { return counter }).catch(error => {
            return 0
          })
        if (count) {
          arrayError.push(new ErrorResponse(
            "createClient",
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
        "createClient",
        "userName",
        `userName is exist already`,
        SERVER_ERRORS.RECORD_IS_EXIST_ALREADY
      ))
      return;
    }
  }

  if (!record.companyNameEnglish) {
    arrayError.push(new ErrorResponse(
      "createClient",
      "companyNameEnglish",
      `companyNameEnglish is empty`,
      SERVER_ERRORS.COMPANY_NAME_EMPTY
    ))
    return
  }
  if (type === "edit") {
    if (recordCheck) {
      if (recordCheck.companyNameEnglish !== record.companyNameEnglish) {
        let count = await model.count({ where: { 'companyNameEnglish': record.companyNameEnglish } })
          .then(counter => { return counter }).catch(error => {
            return 0
          })
        if (count) {
          arrayError.push(new ErrorResponse(
            "createClient",
            "companyNameEnglish",
            `companyNameEnglish is exist already`,
            SERVER_ERRORS.RECORD_IS_EXIST_ALREADY
          ))
          return;
        }
      }
    }
  }
  else {
    count = await model.count({ where: { 'companyNameEnglish': record.companyNameEnglish } })
      .then(counter => { return counter }).catch(error => {
        return 0
      })
    if (count) {
      arrayError.push(new ErrorResponse(
        "createClient",
        "companyNameEnglish",
        `companyNameEnglish is exist already`,
        SERVER_ERRORS.COMPANY_IS_EXIST_ALREADY
      ))
      return;
    }
  }
  if (!record.companyNameArabic) {
    arrayError.push(new ErrorResponse(
      "createClient",
      "companyNameArabic",
      `companyNameArabic is empty`,
      SERVER_ERRORS.COMPANY_NAME_EMPTY
    ))
    return
  }
  if (type === "edit") {
    if (recordCheck) {
      if (recordCheck.companyNameArabic !== record.companyNameArabic) {
        let count = await model.count({ where: { 'companyNameArabic': record.companyNameArabic } })
          .then(counter => { return counter }).catch(error => {
            return 0
          })
        if (count) {
          arrayError.push(new ErrorResponse(
            "createClient",
            "companyNameArabic",
            `companyNameArabic is exist already`,
            SERVER_ERRORS.RECORD_IS_EXIST_ALREADY
          ))
          return;
        }
      }
    }
  }
  else {
    count = await model.count({ where: { 'companyNameArabic': record.companyNameArabic } })
      .then(counter => { return counter }).catch(error => {
        return 0
      })
    if (count) {
      arrayError.push(new ErrorResponse(
        "createClient",
        "companyNameArabic",
        `companyNameArabic is exist already`,
        SERVER_ERRORS.COMPANY_IS_EXIST_ALREADY
      ))
      return;
    }
  }
  if (!record.password)
    arrayError.push(new ErrorResponse(
      "createClient",
      "password",
      `password is empty`,
      SERVER_ERRORS.PASSWORD_EMPTY
    ))
  const RENumber = /^\d+(\.\d+){0,1}$/
  if (!record.clientNameEnglish)
    arrayError.push(new ErrorResponse(
      "createClient",
      "clientNameEnglish",
      `clientNameEnglish is empty`,
      SERVER_ERRORS.NAME_EMPTY
    ))
  if (!record.clientNameArabic)
    arrayError.push(new ErrorResponse(
      "createClient",
      "clientNameArabic",
      `clientNameArabic is empty`,
      SERVER_ERRORS.NAME_EMPTY
    ))
  if (record.emirate === undefined)
    arrayError.push(new ErrorResponse(
      "createClient",
      "emirate",
      `emirate is empty`,
      SERVER_ERRORS.EMIRATE_EMPTY
    ))
  else {
    if (!(record.emirate >= 0 && record.emirate < getEmirates().length))
      arrayError.push(new ErrorResponse(
        "createClient",
        "emirate",
        `emirate is empty`,
        SERVER_ERRORS.EMIRATE_EMPTY
      ))
  }
  if (!record.addressEnglish)
    arrayError.push(new ErrorResponse(
      "createClient",
      "addressEnglish",
      `addressEnglish is empty`,
      SERVER_ERRORS.CITY_EMPTY
    ))
  if (!record.addressArabic)
    arrayError.push(new ErrorResponse(
      "createClient",
      "addressArabic",
      `addressArabic is empty`,
      SERVER_ERRORS.CITY_EMPTY
    ))
  if (!record.clientPhone)
    arrayError.push(new ErrorResponse(
      "createClient",
      "clientPhone",
      `clientPhone is empty`,
      SERVER_ERRORS.PHONE_EMPTY
    ))
  else {
    const result = validationPhone(record.clientPhone, "client")
    if (result) arrayError.push(result)
    if (type === "edit") {
      if (recordCheck) {
        if (recordCheck.clientPhone !== record.clientPhone) {
          let count = await model.count({ where: { 'clientPhone': record.clientPhone } })
            .then(counter => { return counter }).catch(error => {
              return 0
            })
          if (count) {
            arrayError.push(new ErrorResponse(
              "editClient",
              "clientPhone",
              `clientPhone is exist already`,
              SERVER_ERRORS.PHONE_IS_EXIST_ALREADY
            ))
            return;
          }
        }
      }
    }
    else {
      let count = await model.count({ where: { 'clientPhone': record.clientPhone } })
        .then(counter => { return counter }).catch(error => {
          return 0
        })
      if (count) {
        arrayError.push(new ErrorResponse(
          "createDriver",
          "clientPhone",
          `clientPhone is exist already`,
          SERVER_ERRORS.PHONE_IS_EXIST_ALREADY
        ))
        return;
      }
    }
  }
  if (record.companyPhone === undefined)
    arrayError.push(new ErrorResponse(
      "createClient",
      "companyPhone",
      `companyPhone is empty`,
      SERVER_ERRORS.PHONE_EMPTY
    ))
  else {
    const result = validationPhone(record.companyPhone, "company")
    if (result) arrayError.push(result)
    if (type === "edit") {
      if (recordCheck) {
        if (recordCheck.companyPhone !== record.companyPhone) {
          let count = await model.count({ where: { 'companyPhone': record.companyPhone } })
            .then(counter => { return counter }).catch(error => {
              return 0
            })
          if (count) {
            arrayError.push(new ErrorResponse(
              "createDriver",
              "companyPhone",
              `companyPhone is exist already`,
              SERVER_ERRORS.PHONE_IS_EXIST_ALREADY
            ))
            return;
          }
        }
      }
    }
    else {
      let count = await model.count({ where: { 'companyPhone': record.companyPhone } })
        .then(counter => { return counter }).catch(error => {
          return 0
        })
      if (count) {
        arrayError.push(new ErrorResponse(
          "createDriver",
          "companyPhone",
          `companyPhone is exist already`,
          SERVER_ERRORS.PHONE_IS_EXIST_ALREADY
        ))
        return;
      }
    }
  }
  const RELocation = /^(-)?\d+(\.\d+){0,1}$/
  if (!record.latitude)
    arrayError.push(new ErrorResponse(
      "createClient",
      "latitude",
      `latitude is empty`,
      SERVER_ERRORS.LATITUDE__EMPTY
    ))
  else if (!String(record.latitude).match(RELocation))
    arrayError.push(new ErrorResponse(
      "createClient",
      "latitude",
      `latitude is not valid`,
      SERVER_ERRORS.LATITUDE__IS_NOT_VALID
    ))
  if (!record.longitude)
    arrayError.push(new ErrorResponse(
      "createClient",
      "longitude",
      `longitude is empty`,
      SERVER_ERRORS.LONGITUDE__EMPTY
    ))
  else if (!String(record.longitude).match(RELocation))
    arrayError.push(new ErrorResponse(
      "createClient",
      "longitude",
      `longitude is not valid`,
      SERVER_ERRORS.LONGITUDE__IS_NOT_VALID
    ))
  if (!record.companyTypeEnglish)
    arrayError.push(new ErrorResponse(
      "createClient",
      "companyTypeEnglish",
      `companyTypeEnglish is empty`,
      SERVER_ERRORS.COMPANY_TYPE_EMPTY
    ))

  if (!record.companyTypeArabic)
    arrayError.push(new ErrorResponse(
      "createClient",
      "companyTypeArabic",
      `companyTypeArabic is empty`,
      SERVER_ERRORS.COMPANY_TYPE_EMPTY
    ))
  if (!record.contractDate)
  record.contractDate = new Date()
}
const validationPhone = (phone, type) => {
  var phoneno = /^\+971([0-9]{1}|[0-9]{2})[-. ]?([0-9]{3})([-. ]?([0-9]{4}))?$/;
  if (!String(phone).match(phoneno))
    return new ErrorResponse(
      "createClient",
      phone,
      type + " phone is not valid.",
      SERVER_ERRORS.PHONE_NOT_VALID
    )
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
            if (result.length || result.length === 0) return (new Response(true, { result, pageCount, count }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no clients"),
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
  getOrders: async (requestedPage, recordsInPage, id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const count = await models.orders.count({ clientId: id })
          const result = await model.findAll({
            where: { id },
            include: [{
              model: models.orders,
              include: [{
                model: models.drivers
              }],
              limit: recordsInPage,
              offset: (requestedPage - 1) * recordsInPage
            }],
            // limit: recordsInPage,
            // offset: (requestedPage - 1) * recordsInPage
          }).then(result => {
            let orders = result.length?result[0].orders:[]
            orders = orders.map(record => record.dataValues).map(order => {
              order.driverName = order.driver ? order.driver.nickName : undefined;
              delete order['driver'];
              return order;
            })
            let pageCount = Math.ceil(count / recordsInPage);
            if (result.length || result.length === 0) return (new Response(true, { result: orders, pageCount, count }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no orders"),
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
  getCharges: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const count = await models.charges.count({ clientId: id })
          const result = await model.findAll({
            where: { id },
            include: [{
              model: models.charges,
            }],
            order: [
              ['id', 'DESC']
            ]
          }).then(result => {
            if (result.length || result.length === 0) return result.length === 0?[]:result[0].charges
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no charges"),
                code: SERVER_ERRORS.RECORDS_NOT_FOUND,
              })
            )
          }).catch(error => {
            throw (error)
          })
          const pointsAndAmount = await module.exports.getPointsAndAmount(id)
          resolve((new Response(true, {records:result, points:pointsAndAmount?pointsAndAmount.points:0, amount: pointsAndAmount?pointsAndAmount.amount:0}, {})));
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
  getCompaniesNames: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll({ attributes: ['id', 'companyNameEnglish', 'companyNameArabic'] }).then(result => {
            if (result.length ||result.length === 0) return (new Response(true, { result }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no clients"),
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
          const result = await model.destroy({ where: { id } }).then(result => {
            if (result) return (new Response(true, result, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Client not found"),
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
                error: new Response(false, {}, "Client not found"),
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
          let result = await model.findByPk(id, { raw: true }).then(result => {
            if (result) return result//(new Response(true, result, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Client not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
          }).catch(error => {
            throw (error)
          })
          let allPoints = await modelCharges.findAll({
            where: { clientId: id },
            attributes: [
              [sequelize.fn('sum', sequelize.col('points')), 'points'],
            ],
            group: ['clientId']
          })
          if (allPoints&&allPoints.length)
            allPoints = allPoints[0].points
          else allPoints = 0
          const ordersAccounts = await modelOrders.findAll({
            where: { clientId: id, status: 4 },
            attributes: [
              [sequelize.fn('sum', sequelize.col('points')), 'points'],
              [sequelize.fn('sum', sequelize.col('amountReceived')), 'amount']
            ],
            group: ['clientId']
          })
          let allPointsConsumed = 0
          let ordersAmount = 0
          let deliveredAmount = 0
          if (ordersAccounts&&ordersAccounts.length) {
            allPointsConsumed = ordersAccounts[0].points
            ordersAmount = ordersAccounts[0].amount
          }
          const points = allPoints - allPointsConsumed
          const deliveredAccounts = await modelClientsAccounts.findAll({
            where: { clientId: id },
            attributes: [
              [sequelize.fn('sum', sequelize.col('amount')), 'amount']
            ],
            group: ['clientId']
          })
          if (deliveredAccounts&&deliveredAccounts.length) {
            deliveredAmount = deliveredAccounts[0].amount
          }
          const amount = ordersAmount - deliveredAmount
          result = new Response(true, { ...result, points, amount }, {})
          resolve(result);
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  getPointsAndAmount: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let allPoints = await modelCharges.findAll({
            where: { clientId: id },
            attributes: [
              [sequelize.fn('sum', sequelize.col('points')), 'points'],
            ],
            group: ['clientId']
          })
          if (allPoints.length)
            allPoints = allPoints[0].points
          else allPoints = 0
          const ordersAccounts = await modelOrders.findAll({
            where: { clientId: id, status: 4 },
            attributes: [
              [sequelize.fn('sum', sequelize.col('points')), 'points'],
              [sequelize.fn('sum', sequelize.col('amountReceived')), 'amount']
            ],
            group: ['clientId']
          })
          let allPointsConsumed = 0
          let ordersAmount = 0
          let deliveredAmount = 0
          if (ordersAccounts.length) {
            allPointsConsumed = ordersAccounts[0].points
            ordersAmount = ordersAccounts[0].amount
          }
          const points = allPoints - allPointsConsumed
          const deliveredAccounts = await modelClientsAccounts.findAll({
            where: { clientId: id },
            attributes: [
              [sequelize.fn('sum', sequelize.col('amount')), 'amount']
            ],
            group: ['clientId']
          })
          if (deliveredAccounts.length) {
            deliveredAmount = deliveredAccounts[0].amount
          }
          const amount = ordersAmount - deliveredAmount
          const result = { points, amount }
          resolve(result);
        } catch (error) {
          reject(error)
        }
      })()
    })
  }
};