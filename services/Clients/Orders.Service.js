const createError = require("http-errors");
const models = require("../../models");
const { Response } = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");
const { getRecordsCountInPage } = require("../../helpers/Constants");

const model = models.orders
module.exports = {
  getAll: async (requestedPage, recordsInPage, clientId) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (!(requestedPage == null || requestedPage <= 0)) requestedPage = parseInt(requestedPage)
          if (recordsInPage == null || recordsInPage <= 0) recordsInPage = getRecordsCountInPage();
          recordsInPage = parseInt(recordsInPage)
          let count = await model.count({where:{clientId}})
            .then(counter => { return counter }).catch(error => {
              throw (error)
            })
          let pageCount = Math.ceil(count / requestedPage?recordsInPage:1);
          const options = requestedPage?{
            where:{clientId},
            include: [{
              model: models.clients,
              attributes: ['companyNameEnglish', 'companyNameArabic']
            }],
            limit: recordsInPage,
            offset: (requestedPage - 1) * recordsInPage,
            order: [
              ['id', 'DESC']
            ]
          }:{
            where:{clientId},
            include: [{
              model: models.clients,
              attributes: ['companyNameEnglish', 'companyNameArabic']
            }],
            order: [
              ['id', 'DESC']
            ]
          }
          const result = await model.findAll(options).then(result => {
            if (result.length) {
              result = result.map(record => record.dataValues)
              result = result.map(record => {
                record.companyNameEnglish = record.client?record.client.companyNameEnglish:undefined;
                record.companyNameArabic = record.client?record.client.companyNameArabic:undefined;
                delete record['client'];
                return record;
              })
              return (new Response(true, { result, count, pageCount }, {}))
            }
            else if(result.length===0)
              return (new Response(true, { result, count, pageCount }, {}))
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
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findByPk(id, {
            include: [{
              model: models.clients,
              attributes: ['companyNameEnglish', 'companyNameArabic']
            },
            {
              model: models.drivers,
              attributes: ['nickName']
            }],
          }).then(result => {
            if (result) {
              result = result.dataValues;
              result.companyNameEnglish = result.client?result.client.companyNameEnglish:undefined;
              result.companyNameArabic = result.client?result.client.companyNameArabic:undefined;
              delete result['client'];
              result.driverName = result.driver?result.driver.nickName:undefined; delete result['driver'];
              return (new Response(true, result, {}))
            }
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Order not found"),
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