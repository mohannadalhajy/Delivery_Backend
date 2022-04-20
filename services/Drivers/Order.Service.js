const createError = require("http-errors");
const models = require("../../models");
const { Response } = require("../../helpers/Response.Helper");
const SERVER_ERRORS = require("../../helpers/ServerErrors.Helper");
const OrdersNotificationsService = require("./OrdersNotifications.Service");
const NotificationsService = require("../Notifications.Service");
const OrderService = require("../Orders.Service");
const { sendCancelOrderNotification, sendNewOrderNotification } = require("../../firebase/notifications");
const { updateStatus } = require("./Profile.Service");
// const { processDeliveryOrder } = require("../Orders.Service");
const model = models.orders
const getNotification = async (id) => {
  const result = await OrdersNotificationsService.findById(id)
  return result.result
}
const getNotificationsByOrder = async (id) => {
  const result = await OrdersNotificationsService.findByOrder(id)
  return result.result
}
const getOrder = async (id) => {
  const result = await OrderService.findBaseById(id)
  return result.result
}
const acceptStatusChange = async (order, orderNotifiction) => {
  order.status = 2
  order.driverId = orderNotifiction.driverId
  orderNotifiction.status = 2
  orderNotifiction.acceptedDate = new Date()
  await updateStatus(orderNotifiction.driverId, 0)
  await order.save()
  await orderNotifiction.save()
}
const cancelStatusChange = async (order, orderNotifictions) => {
  order.status = 1
  order.canceledDate = new Date()
  await order.save()
  for (let i = 0; i < orderNotifictions.length; i++) {
    orderNotifictions[i].status = 7
    const driver = await updateStatus(orderNotifictions[i].driverId, 1)
    const orderNotifiction = await NotificationsService.add({ driverId: driver.id, orderId: order.id })
    sendCancelOrderNotification(driver.result.firebaseToken, orderNotifiction.result.id)
    await orderNotifictions[i].save()
  }
}
const rejectStatusChange = async (orderNotifiction, rejectReason) => {
  orderNotifiction.status = 1
  orderNotifiction.rejectedDate = new Date()
  orderNotifiction.rejectedReason = rejectReason
  // await updateStatus(orderNotifiction.driverId, 2)
  await orderNotifiction.save()
}
const editedStatusChange = async (order, orderNotifiction, editedReason) => {
  orderNotifiction.status = 8
  order.status = 6
  orderNotifiction.rejectedDate = new Date()
  order.editedReason = editedReason
  order.amountReceived = 0
  await updateStatus(orderNotifiction.driverId, 1)
  await order.save()
  await orderNotifiction.save()
}
const failedStatusChange = async (order, orderNotifiction, failedReason) => {
  order.status = 5
  orderNotifiction.status = 4
  order.failedDate = new Date()
  order.failedReason = failedReason
  await order.save()
  await updateStatus(orderNotifiction.driverId, 1)
  await orderNotifiction.save()
}
const expiredStatusChange = async (orderNotifiction) => {
  orderNotifiction.status = 5
  await orderNotifiction.save()
}
const pickUpStatusChange = async (order, orderNotifiction) => {
  order.status = 3
  orderNotifiction.status = 6
  orderNotifiction.receivedDate = new Date()
  await order.save()
  await orderNotifiction.save()
}
const deliveredStatusChange = async (order, orderNotifiction) => {
  order.status = 4
  orderNotifiction.status = 3
  orderNotifiction.deliveredDate = new Date()
  await order.save()
  if (orderNotifiction.driverId)
    await updateStatus(orderNotifiction.driverId, 1)
  await orderNotifiction.save()
}
const calcPoints = (order)=>{
  let points = 1
  if (order.transportType) points = 2
  return points
}
module.exports = {
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const notification = await models.orders_notifications.findByPk(id, {
            attributes: [
              ['id', 'notificationId'],
              'orderId',
              'status',
              'acceptedDate',
              'deliveredDate',
              'receivedDate']
          }).then(result => {
            // if (result) {
            return result
            // }
            // else return 
            // throw (
            //   createError.NotFound({
            //     error: new Response(false, {}, "Notification not found"),
            //     code: SERVER_ERRORS.RECORD_NOT_FOUND,
            //   })
            // )
          }).catch(error => {
            throw (error)
          })
          if (!notification)
            resolve(new Response(false, {}, "Notification not found"));
          const order = await model.findByPk(notification.orderId, {
            attributes: [
              ['id', 'orderId'],
              'amount',
              'transportType',
              'addressEnglish',
              'addressArabic',
              'emirate',
              'location'],
            include: [{
              model: models.clients,
              attributes: [
                'emirate',
                'companyNameEnglish',
                'companyNameArabic',
                'addressEnglish',
                'addressArabic',
                'companyTypeEnglish',
                'companyTypeArabic',
                'companyPhone',
                'latitude',
                'longitude',
                'image']
            }, {
              model: models.customers,
              attributes: [
                'nameEnglish',
                'nameArabic',
                'phone']
            }],
          }).then(result => {
            // if (result) {
            return result
            // }
            // else throw (
            //   createError.NotFound({
            //     error: new Response(false, {}, "Order not found"),
            //     code: SERVER_ERRORS.RECORD_NOT_FOUND,
            //   })
            // )
          }).catch(error => {
            throw (error)
          })
          if (!order)
            resolve(new Response(false, {}, "Order not found"));
          delete notification.orderId
          var result = {};
          for (var attrname in notification.dataValues) { result[attrname] = notification.dataValues[attrname]; }
          for (var attrname in order.dataValues) { result[attrname] = order.dataValues[attrname]; }
          resolve(new Response(true, result, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  acceptOrder: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orderNotifiction = await getNotification(id)
          const order = await getOrder(orderNotifiction.orderId)
          if (order.status !== 0)
            resolve(new Response(false, {}, "This order is not waiting"));
          // throw (
          //   createError.NotFound({
          //     error: new Response(false, {}, "This order is not waiting"),
          //     code: SERVER_ERRORS.RECORD_NOT_FOUND,
          //   })
          // )
          await acceptStatusChange(order, orderNotifiction)
          resolve(new Response(true, {}, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  failedOrder: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orderNotifiction = await getNotification(record.id)
          const order = await getOrder(orderNotifiction.orderId)
          await failedStatusChange(order, orderNotifiction, record.reason)
          resolve(new Response(true, {}, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  expiredOrder: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orderNotifiction = await getNotification(id)
          await expiredStatusChange(orderNotifiction)
          resolve(new Response(true, {}, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  ////process
  rejectOrder: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orderNotifiction = await getNotification(record.id)
          const order = await getOrder(orderNotifiction.orderId)
          rejectStatusChange(orderNotifiction, record.reason)
          //processDeliveryOrder(order,[orderNotifiction.driverId])
          resolve(new Response(true, {}, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  editOrder: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orderNotifiction = await getNotification(record.id)
          const order = await getOrder(orderNotifiction.orderId)
          await editedStatusChange(order, orderNotifiction, record.reason)
          resolve(new Response(true, {}, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  deliverOrder: async (record) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orderNotifiction = await getNotification(record.id)
          const order = await getOrder(orderNotifiction.orderId)
          order.amountReceived = record.amountReceived
          order.notes = record.notes
          const points = calcPoints(order)
          order.points = points
          await deliveredStatusChange(order, orderNotifiction)
          resolve(new Response(true, {}, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  pickUpOrder: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orderNotifiction = await getNotification(id)
          const order = await getOrder(orderNotifiction.orderId)
          await pickUpStatusChange(order, orderNotifiction)
          resolve(new Response(true, {}, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  },
  cancelOrder: async (id) => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const orderNotifictions = await getNotificationsByOrder(id)
          const order = await getOrder(id)
          await cancelStatusChange(order, orderNotifictions)
          resolve(new Response(true, {}, {}));
        } catch (error) {
          reject(error)
        }
      })()
    })
  }
};