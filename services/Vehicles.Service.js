const createError = require("http-errors");
const models = require("../models");
const {
  Response, ErrorResponse,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const Op = require('sequelize').Op;
const model = models.vehicles
const validation = async (record, arrayError, type) => {
  if (!record) {
    arrayError.push(new ErrorResponse(
      "createVehicle",
      "Vehicle",
      "Vehicle can not be empty.",
      SERVER_ERRORS.RECORD_EMPTY
    ))
    return;
  }
  if (type === "edit") {
    const recordCheck = await model.findByPk(record.id).then(result => {
      return result
    }).catch(error => {
      return 0
    })
    if (recordCheck) {
      if (recordCheck.number !== record.number) {
        let count = await model.count({ where: { 'number': record.number } })
          .then(counter => { return counter }).catch(error => {
            return 0
          })
        if (count) {
          arrayError.push(new ErrorResponse(
            "createDriver",
            "number",
            `number is exist already`,
            SERVER_ERRORS.RECORD_IS_EXIST_ALREADY
          ))
          return;
        }
      }
    }
  }
  else {
    let count = await model.count({ where: { 'number': record.number } })
      .then(counter => { return counter }).catch(error => {
        return 0
      })
    if (count) {
      arrayError.push(new ErrorResponse(
        "createDriver",
        "number",
        `number is exist already`,
        SERVER_ERRORS.RECORD_IS_EXIST_ALREADY
      ))
      return;
    }
  }
  if (!record.startDate) record.startDate = new Date()
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
            if (result.length||result.length===0) return (new Response(true, { result, pageCount, count }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no vehicles"),
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
  getNumbers: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll({ attributes: ['id', 'number'] }).then(result => {
            if (result.length||result.length===0) return (new Response(true, { result }, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "There is no vehicles"),
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
  getBusyNumbers: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll(
            {
              attributes: ['id', 'number'],
              include: [{
                attributes: [],
                model: models.drivers_vehicles,
                where: {
                  endDate: null
                }
              }]
            }).then(result => {
              if (result.length||result.length===0) return (new Response(true, { result }, {}))
              else throw (
                createError.NotFound({
                  error: new Response(false, {}, "There is no vehicles"),
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
  getFreeNumbers: async () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findAll(
            {
              attributes: ['id', 'number'],
              include: [{
                attributes: ['endDate'],
                model: models.drivers_vehicles
              }]
            }).then(result => {
              if (result.length||result.length===0) result = result.filter(record => !record.driver_vehicles.some(driver_vehicle => driver_vehicle.endDate == null))
              if (result.length||result.length===0) return (new Response(true, { result }, {}))
              else throw (
                createError.NotFound({
                  error: new Response(false, {}, "There is no vehicles"),
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
                error: new Response(false, {}, "Vehicle not found"),
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
                error: new Response(false, {}, "Vehicle not found"),
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
                error: new Response(false, {}, "Vehicle not found"),
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
