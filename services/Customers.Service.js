const createError = require("http-errors");
const models = require("../models");
const {
  Response, ErrorResponse,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const { getRecordsCountInPage } = require("../helpers/Constants");
// const { getEmirates } = require("../helpers/Constants");
const model = models.customers
const validation = async (record, arrayError, type, clientId) => {
  if (!record) {
    arrayError.push(new ErrorResponse(
      "createCustomer",
      "Customer",
      "Customer can not be empty.",
      SERVER_ERRORS.RECORD_EMPTY
    ))
    return;
  }
  const recordCheck = await model.findByPk(record.id).then(result => {
    return result
  }).catch(error => {
    return 0
  })
  if (!record.nameEnglish)
    arrayError.push(new ErrorResponse(
      "createCustomer",
      "nameEnglish",
      `nameEnglish is empty`,
      SERVER_ERRORS.NAME_EMPTY
    ))
  if (!record.nameArabic)
    arrayError.push(new ErrorResponse(
      "createCustomer",
      "nameArabic",
      `nameArabic is empty`,
      SERVER_ERRORS.NAME_EMPTY
    ))
  // if (record.emirate===undefined)
  //   arrayError.push(new ErrorResponse(
  //     "createCustomer",
  //     "emirate",
  //     `emirate is empty`,
  //     SERVER_ERRORS.EMIRATE_EMPTY
  //   ))
  // else {
  //   if (!(record.emirate>=0&&record.emirate<getEmirates().length))
  //     arrayError.push(new ErrorResponse(
  //       "createCustomer",
  //       "emirate",
  //       `emirate is empty`,
  //       SERVER_ERRORS.EMIRATE_EMPTY
  //     ))
  // }
  if (!record.phone)
    arrayError.push(new ErrorResponse(
      "createCustomer",
      "phone",
      `phone is empty`,
      SERVER_ERRORS.PHONE_EMPTY
    ))
  else {
    const result = validationPhone(record.phone)
    if (result) arrayError.push(result)
    if (type === "edit") {
      if (recordCheck) {
        if (recordCheck.phone !== record.phone) {
          let count = await model.count({ where: { 'phone': record.phone, clientId } })
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
      let count = await model.count({ where: { 'phone': record.phone, clientId } })
        .then(counter => { return counter }).catch(error => {
          return 0
        })
      if (count) {
        arrayError.push(new ErrorResponse(
          "CreateCustomer",
          "phone",
          `phone is exist already`,
          SERVER_ERRORS.PHONE_IS_EXIST_ALREADY
        ))
        return;
      }
    }
  }
  const RELocation = /^(-)?\d+(\.\d+){0,1}$/
  // if (!record.latitude)
  //   arrayError.push(new ErrorResponse(
  //     "createCustomer",
  //     "latitude",
  //     `latitude is empty`,
  //     SERVER_ERRORS.LATITUDE__EMPTY
  //   ))
  // else if (!String(record.latitude).match(RELocation))
  //   arrayError.push(new ErrorResponse(
  //     "createCustomer",
  //     "latitude",
  //     `latitude is not valid`,
  //     SERVER_ERRORS.LATITUDE__IS_NOT_VALID
  //   ))
  // if (!record.longitude)
  //   arrayError.push(new ErrorResponse(
  //     "createCustomer",
  //     "longitude",
  //     `longitude is empty`,
  //     SERVER_ERRORS.LONGITUDE__EMPTY
  //   ))
  // else if (!String(record.longitude).match(RELocation))
  //   arrayError.push(new ErrorResponse(
  //     "createCustomer",
  //     "longitude",
  //     `longitude is not valid`,
  //     SERVER_ERRORS.LONGITUDE__IS_NOT_VALID
  //   ))
}
const validationPhone = (phone) => {
  var phoneno = /^\+971([0-9]{1}|[0-9]{2})[-. ]?([0-9]{3})([-. ]?([0-9]{4}))?$/;
  if (!String(phone).match(phoneno))
    return new ErrorResponse(
      "createCustomer",
      phone,
      "Customer phone is not valid.",
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
            offset: (requestedPage - 1) * recordsInPage,
            include: [{
              model: models.clients
            }]
          }).then(result => {
            if (result.length||result.length===0) return (new Response(true, { result, pageCount, count }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no customers"),
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
  getNames: async (clientId) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll({
            where: { clientId },
            attributes: ['id', 'nameEnglish', 'nameArabic']
          }).then(result => {
            if (result.length||result.length===0) return (new Response(true, { result }, {}))
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
  getAllToClient: async (clientId, requestedPage, recordsInPage) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try { 
          if (!(requestedPage == null || requestedPage <= 0)) requestedPage = parseInt(requestedPage)
          if (recordsInPage == null || recordsInPage <= 0) recordsInPage = getRecordsCountInPage();
          recordsInPage = parseInt(recordsInPage)
          let count = await model.count({ where: { clientId } })
            .then(counter => { return counter }).catch(error => {
              throw (error)
            })
          let pageCount = Math.ceil(count / requestedPage?recordsInPage:1);
          const options = requestedPage?{
            where: { clientId },
            limit: recordsInPage,
            offset: (requestedPage - 1) * recordsInPage
          }:{
            where: { clientId }
          }
          const result = await model.findAll(options).then(result => {
            if (result.length||result.length===0) return (new Response(true, { result, pageCount, count }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no customers"),
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
          const count = await models.orders.count({ where: { customerId: id } })
          const result = await model.findAll({
            where: { id },
            include: [{
              model: models.orders,
              limit: recordsInPage,
              offset: (requestedPage - 1) * recordsInPage
            }],
          }).then(result => {
            let orders = result.length===0?[]:result[0].orders
            let pageCount = Math.ceil(count / recordsInPage);
            if (result.length||result.length===0) return (new Response(true, { result: orders, pageCount, count }, {}))
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
                error: new Response(false, {}, "Customer not found"),
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
                error: new Response(false, {}, "Customer not found"),
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
  add: async (record, clientId) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const arrayError = []
          await validation(record, arrayError, "add", clientId)
          if (arrayError.length) throw (createError.Conflict({
            arrayError,
            code: SERVER_ERRORS.RECORD_IS_NOT_VALID,
          }))
          record.clientId = clientId
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
          const result = await model.findByPk(id).then(result => {
            if (result) return (new Response(true, result, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Customer not found"),
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