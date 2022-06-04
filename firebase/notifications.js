const admin = require("./initFirebase");
// const { Expo } = require('expo-server-sdk');
module.exports = {
  NOTIFY_TYPES: () => {
    return {
      NEW_ORDER: "NEW_ORDER",
      CANCEL_ORDER: "CANCEL_ORDER"
    };
  },
  sendNewOrderNotification: async (token, notificationId) => {
    // if (!Expo.isExpoPushToken(token)) {
    //   console.error(`Push token ${token} is not a valid Expo push token`);
    // }
    const message = {
      //      notification: {
      //        title: "Order",
      //        body: "New Order",
      //    },
      data: {
        title: "Order",
        body: "New Order",
        NOTIFY_TYPE: module.exports.NOTIFY_TYPES().NEW_ORDER,
        offer_id: notificationId.toString(),
      },
      tokens: [token],
    };
    admin
      .messaging()
      .sendMulticast(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
    // const messages = [{
    //   to: token,
    //   sound: 'default',
    //   title: 'Order',
    //   body: 'New Order',
    //   data: {
    //     NOTIFY_TYPE: module.exports.NOTIFY_TYPES().NEW_ORDER,
    //     notificationId: notificationId.toString(),
    //   },
    // }]
    // try {

    //await admin.sendPushNotificationsAsync(admin.chunkPushNotifications(messages)[0]);
    // } catch (error) {
    //   console.error(error);
    // }
  },
  sendNewOrderNotificationToAdmins: async (tokens) => {
    // if (!Expo.isExpoPushToken(token)) {
    //   console.error(`Push token ${token} is not a valid Expo push token`);
    // }
    const message = {
      //      notification: {
      //        title: "Order",
      //        body: "New Order",
      //    },
      data: {
        title: "Order",
        body: "New Order",
        NOTIFY_TYPE: module.exports.NOTIFY_TYPES().NEW_ORDER,
        offer_id: module.exports.NOTIFY_TYPES().NEW_ORDER,
      },
      tokens: tokens
    };
    admin
      .messaging()
      .sendMulticast(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
    // const messages = [{
    //   to: token,
    //   sound: 'default',
    //   title: 'Order',
    //   body: 'New Order',
    //   data: {
    //     NOTIFY_TYPE: module.exports.NOTIFY_TYPES().NEW_ORDER,
    //     notificationId: notificationId.toString(),
    //   },
    // }]
    // try {

    //await admin.sendPushNotificationsAsync(admin.chunkPushNotifications(messages)[0]);
    // } catch (error) {
    //   console.error(error);
    // }
  },
  sendCancelOrderNotification: async (token, notificationId) => {
    // if (!Expo.isExpoPushToken(token)) {
    //   console.error(`Push token ${token} is not a valid Expo push token`);
    // }
    const messages = [{
      to: token,
      sound: 'default',
      title: 'Order',
      body: 'Cancel Order',
      data: {
        NOTIFY_TYPE: module.exports.NOTIFY_TYPES().CANCEL_ORDER,
        notificationId: notificationId.toString(),
      },
    }]
    try {
      await admin.sendPushNotificationsAsync(admin.chunkPushNotifications(messages)[0]);
    } catch (error) {
      console.error(error);
    }
  },
};
