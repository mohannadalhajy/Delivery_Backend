const createError = require("http-errors");
const models = require("../models");
const { Response } = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const { sendNewOrderNotification } = require("../firebase/notifications");
// const { findAppropriateDriver } = require("./Drivers.Service");
const NotificationsService = require("./Notifications.Service");
const Op = require('sequelize').Op;
const ClientsService = require("./Clients.Service");
const services = require("./Drivers.Service");
const validation = async (order, arrayError) => {
}
const model = models.orders
// const expiredStatusChange = async (orderNotifiction) => {
//   orderNotifiction.status = 5
//   await orderNotifiction.save()
// }
// const getClient = async (id) => {
//   const result = await ClientsService.findById(id)
//   return result.result
// }
module.exports = {
  getAll: async (requestedPage, recordsInPage, type) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let count = await model.count(type?{ where: { status: type } }:{})
            .then(counter => { return counter }).catch(error => {
              throw (error)
            })
          let pageCount = Math.ceil(count / recordsInPage);
          const options = {
            include: [{
              model: models.clients,
              attributes: ['companyNameEnglish', 'companyNameArabic']
            },
            {
              model: models.drivers,
              attributes: ['nickName']
            }],
            order: [
              ['id', 'DESC']
            ],
            limit: recordsInPage,
            offset: (requestedPage - 1) * recordsInPage
          }
          const result = await model.findAll(type?{...options,where: { status: type }}:options).then(result => {
              if (result.length) {
                result = result.map(record => record.dataValues)
                result = result.map(record => {
                  record.companyNameEnglish = record.client ? record.client.companyNameEnglish : undefined;
                  record.companyNameArabic = record.client ? record.client.companyNameArabic : undefined;
                  delete record['client'];
                  record.driverName = record.driver ? record.driver.nickName : undefined;
                  delete record['driver'];
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
  delete: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.destroy({ where: { id } }).then(result => {
            if (result) return (new Response(true, result, {}))
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
  },
  updateDriver: async (id, newRecord) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let result = await model.update({driverId:newRecord.driverId}, { where: { id } }).then(result => {
            if (result[0]) return (new Response(true, newRecord, {}))
            else throw (
              createError.NotFound({
                error: new Response(false, {}, "Order not found"),
                code: SERVER_ERRORS.RECORD_NOT_FOUND,
              })
            )
          }).catch(error => {
            throw (error)
          })
          result = await module.exports.findById(id)
          await module.exports.processDeliveryOrder(id, newRecord.driverId)
          resolve(new Response(true, result.result, {}));
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
          /*const arrayError = []
          await validation(record, arrayError, "add")
          if (arrayError.length) throw (createError.Conflict({
            arrayError,
            code: SERVER_ERRORS.RECORD_IS_NOT_VALID,
            driverId
            startDate
            endDate
            status
          }))*/
          // if (record.customerPhone) {
          //   const customer = await models.customers.create({ phone: record.customerPhone, nameEnglish: record.customerName }).then(result => {
          //     return result
          //   }).catch(error => {
          //     console.log(error)
          //     throw (error)
          //   })
          //   record = { ...record, startDate: new Date(), status: 0, customerId: customer.id }
          // }
          record = { ...record, startDate: new Date(), status: 0 }
          const order = await model.create(record).then(result => {
            return result
          }).catch(error => {
            console.log(error)
            throw (error)
          })
          module.exports.updateDriver(order.id, {driverId:6})
          //module.exports.processDeliveryOrder(order)
          resolve(new Response(true, order, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  processDeliveryOrder: async (orderId, driverId) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const driver = await services.findBaseById(driverId)
          if (driver) {
            const orderNotifiction = await NotificationsService.add({ driverId: driver.id, orderId })
            const notificationId = orderNotifiction.result.id
            await sendNewOrderNotification(driver.firebaseToken, notificationId)
          }
          resolve(new Response(true, orderId, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  // processDeliveryOrder: async (order, blockedDrivers) => {
  //   return new Promise((resolve, reject) => {
  //     (async () => {
  //       try {
  //         const client = await getClient(order.clientId)
  //         const driver = await findAppropriateDriver(order, blockedDrivers, client)
  //         if (driver) {
  //           const orderNotifiction = await NotificationsService.add({ driverId: driver.id, orderId: order.id })
  //           const notificationId = orderNotifiction.result.id
  //           await sendNewOrderNotification(driver.firebaseToken, notificationId)
  //           setTimeout(function () {
  //             const promise = module.exports.findBaseById(order.id)
  //             promise.then(res => {
  //               const currentOrder = res.result
  //               if (currentOrder.status === 0) {
  //                 expiredStatusChange(orderNotifiction.result)
  //                 blockedDrivers.push(driver.id)
  //                 module.exports.processDeliveryOrder(currentOrder, blockedDrivers)
  //                 module.exports.deliverOldestOrder(currentOrder.id)
  //               }
  //             })
  //           }, 1.5 * 60 * 1000);
  //         }
  //         resolve(new Response(true, order, {}));
  //       } catch (error) {
  //         reject(error)
  //       }
  //     })()
  //   })
  // },
  deliverOldestOrder: async (blockedOrder) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orders = await model.findAll({
            where: {
              status: 0,
              id: { [Op.ne]: blockedOrder },
            }
          })
          if (orders.length === 0)
            resolve(new Response(true, {}, {}));
          else {
            const order = orders[0]
            module.exports.processDeliveryOrder(order, [])
            resolve(new Response(true, order, {}));
          }
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
  },
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await model.findByPk(id, {
            include: [{
              model: models.clients,
              attributes: ['companyNameArabic', 'companyNameEnglish']
            },
            {
              model: models.drivers,
              attributes: ['nickName']
            },
            {
              model: models.customers,
              attributes: [['nameEnglish', 'customerName'], ['nameArabic', 'customerNameArabic'], ['phone', 'customerPhone']]
            }],
          }).then(result => {
            if (result) {
              result = result.dataValues;
              result.companyNameArabic = result.client ? result.client.companyNameArabic : undefined;
              result.companyNameEnglish = result.client ? result.client.companyNameEnglish : undefined;
              delete result['client'];
              result.driverName = result.driver ? result.driver.nickName : undefined;
              delete result['driver'];
              result.customerName = result.customer ? result.customer.dataValues.customerName : undefined;
              result.customerPhone = result.customer ? result.customer.dataValues.customerPhone : undefined;
              result.customerNameArabic = result.customer ? result.customer.dataValues.customerNameArabic : undefined;
              delete result['customer'];
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