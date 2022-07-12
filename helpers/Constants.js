const Emirates = ["AD", "AJM", "FUJ", "SHJ", "DUBAI", "Muwailih", "RAK", "UQ", "AIN","WEST"]
const ORDER_EMIRATES = ["AJM", "SHJ", "DUBAI", "UQ", "Muwailih"]
const ORDER_TYPES = ["Internal","External","Purchase order"]
const TRANSPORT_TYPES = ["Bike","Car"]
const VEHICLES_SERVICE_TYPES = ["Owning","Rent"]
const VISA_TYPES = ["Visit", "Resident", "Loan"]
const DRIVER_STATUS = ["Busy", "Available", "Unavailable"]
const SHIFT_TYPES = ["Morning", "Evening", "Night"]
const ORDER_STATUS_TYPES =               ["Waiting", "Canceled", "Waiting driver", "In progress",  "Deliverd", "Failed", , "Edited"]
const ORDERS_NOTIFICATION_STATUS_TYPES = ["Waiting", "Rejected", "Accepted", "Deliverd", "Failed", "Expired", "Picked up","Canceled", "Edited"]
function getRecordsCountInPage(){return 50}
function getOrderStatusTypes(){return ORDER_STATUS_TYPES}
function getOrdersNotificationsStatusTypes(){return ORDERS_NOTIFICATION_STATUS_TYPES}
function getEmirates(){return Emirates}
function getDriverStatus(){return DRIVER_STATUS}
module.exports = {
    getEmirates,
    getOrderStatusTypes,
    getRecordsCountInPage,
    getOrdersNotificationsStatusTypes,
    getDriverStatus
  }