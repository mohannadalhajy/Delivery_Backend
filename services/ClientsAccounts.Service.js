const createError = require("http-errors");
const models = require("../models");
const { Response } = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const Op = require('sequelize').Op;
const validation = async (record, arrayError) => {
}
const model = models.clients_accounts
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
          const options = {
            include: [{
              model: models.clients,
              attributes: ['companyNameEnglish', 'companyNameArabic']
            }],
            order: [
              ['id', 'DESC']
            ],
            limit: recordsInPage,
            offset: (requestedPage - 1) * recordsInPage
          }
          const result = await model.findAll(options).then(result => {
              if (result.length) {
                result = result.map(record => record.dataValues)
                result = result.map(record => {
                  record.companyNameEnglish = record.client ? record.client.companyNameEnglish : undefined;
                  record.companyNameArabic = record.client ? record.client.companyNameArabic : undefined;
                  delete record['client'];
                  return record;
                })
                return (new Response(true, { result, count, pageCount }, {}))
              }
              else if (result.length===0)
              return (new Response(true, { result, count, pageCount }, {}))
              else throw (
                createError.NotFound({
                  error: new Response(false, {}, "There is no accounts"),
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
                error: new Response(false, {}, "account not found"),
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
                error: new Response(false, {}, "record not found"),
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
          record = { ...record, date: new Date(), status: 0 }
          const result = await model.create(record).then(result => {
            return result
          }).catch(error => {
            console.log(error)
            throw (error)
          })
          resolve(new Response(true, result, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  findBaseById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findByPk(id).then(result => {
            if (result) {
              return (new Response(true, result, {}))
            }
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "record not found"),
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
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findByPk(id, {
            include: [{
              model: models.clients,
              attributes: ['companyNameArabic', 'companyNameEnglish']
            }],
          }).then(result => {
            if (result) {
              result = result.dataValues;
              result.companyNameArabic = result.client ? result.client.companyNameArabic : undefined;
              result.companyNameEnglish = result.client ? result.client.companyNameEnglish : undefined;
              delete result['client'];
              return (new Response(true, result, {}))
            }
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "record not found"),
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