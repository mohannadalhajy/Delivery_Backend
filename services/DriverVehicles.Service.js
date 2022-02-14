const createError = require("http-errors");
const models = require("../models");
const {
    Response, ErrorResponse,
} = require("../helpers/Response.Helper");
const SERVER_ERRORS = require("../helpers/ServerErrors.Helper");
const model = models.drivers_vehicles;
const modelDriver = models.drivers;
const modelVehicle = models.vehicles;
const Op = require('sequelize').Op;
const validation = async (record, arrayError) => {
    if (!record || !record.driverId) {
        arrayError.push(new ErrorResponse(
            "addDriveVehicle",
            "DriveVehicle",
            "Driver can not be empty.",
            SERVER_ERRORS.RECORD_EMPTY
        ))
        return;
    }
    if (!record.startDate) record.startDate = new Date()
    if (!record.vehicleId) {
        arrayError.push(new ErrorResponse(
            "addDriveVehicle",
            "DriveVehicle",
            "Vehicle can not be empty.",
            SERVER_ERRORS.RECORD_EMPTY
        ))
        return;
    }
    const driver = await modelDriver.findByPk(record.driverId).then(result => {
        return result
    }).catch(() => { return 0; })
    if (!driver) {
        arrayError.push(new ErrorResponse(
            "addDriveVehicle",
            "DriveVehicle",
            "Driver is not found.",
            SERVER_ERRORS.RECORD_NOT_FOUND
        ))
        return;
    }
    const vehicle = await modelVehicle.findByPk(record.vehicleId).then(result => {
        return result
    }).catch(() => { return 0; })
    if (!vehicle) {
        arrayError.push(new ErrorResponse(
            "addDriveVehicle",
            "DriveVehicle",
            "Vehicle is not found.",
            SERVER_ERRORS.RECORD_NOT_FOUND
        ))
        return;
    }
    let driverVehicles = await model.findAll(
        {
            where: {
                endDate: null,
                vehicleId: record.vehicleId
            }
        }
    )
    if (driverVehicles.length !== 0)
        arrayError.push(new ErrorResponse(
            "addDriveVehicle",
            driverVehicles,
            "Vehicle1 is not found.",
            SERVER_ERRORS.RECORD_NOT_FOUND
        ))

    driverVehicles = await model.findAll(
        {
            where: {
                endDate: null,
                driverId: record.driverId
            }
        }
    )
    if (driverVehicles.length !== 0)
        arrayError.push(new ErrorResponse(
            "addDriveVehicle",
            driverVehicles,
            "Driver1 is not found.",
            SERVER_ERRORS.RECORD_NOT_FOUND
        ))
}
module.exports = {
    getDrivers: async (requestedPage, recordsInPage) => {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    let count = await modelDriver.count()
                        .then(counter => { return counter }).catch(error => {
                            throw (error)
                        })
                    let pageCount = Math.ceil(count / recordsInPage);
                    const result = await modelDriver.findAll({
                        attributes: ['nickName'],
                        limit: recordsInPage,
                        offset: (requestedPage - 1) * recordsInPage,
                        include: [{
                            attributes: ['startDate', 'endDate'],
                            model: model,
                            include: [{
                                attributes: ['number', 'type'],
                                model: models.vehicles
                            }]
                        }]
                    }).then(result => {
                        if (result.length) {
                            result = result.map(record => record.dataValues).map(record => {
                                //console.log(record.driver_vehicles[0].vehicle.number)
                                if (record.driver_vehicles[0]) {
                                    record.vehicle = record.driver_vehicles[0].vehicle
                                    record.startDate = record.driver_vehicles[0].startDate
                                    record.endDate = record.driver_vehicles[0].endDate
                                }
                                if (record.vehicle) {
                                    record.number = record.vehicle.number
                                    record.type = record.vehicle.type
                                }
                                delete record['vehicle']
                                delete record['driver_vehicles']
                                return record
                            })
                            return (new Response(true, { drivers: result, pageCount, count }, {}))
                        }
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
    getVehicles: async (requestedPage, recordsInPage) => {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    let count = await modelVehicle.count()
                        .then(counter => { return counter }).catch(error => {
                            throw (error)
                        })
                    let pageCount = Math.ceil(count / recordsInPage);
                    const result = await modelVehicle.findAll({
                        attributes: ['number', 'type'],
                        limit: recordsInPage,
                        offset: (requestedPage - 1) * recordsInPage,
                        include: [{
                            attributes: ['startDate', 'endDate'],
                            model: model,
                            include: [{
                                attributes: ['nickName'],
                                model: models.drivers
                            }]
                        }]
                    }).then(result => {
                        result = result.map(record => record.dataValues).map(record => {
                            record.driver = record.driver_vehicles[0].driver
                            record.startDate = record.driver_vehicles[0].startDate
                            record.endDate = record.driver_vehicles[0].endDate
                            record.nickName = record.driver ? record.driver.nickName : undefined
                            delete record['driver']
                            delete record['driver_vehicles']
                            return record
                        })
                        if (result.length) return (new Response(true, { vehicles: result, pageCount, count }, {}))
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
    getTransactions: async (requestedPage, recordsInPage) => {
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
                        order: [['updatedAt', 'DESC']],
                        attributes: ['startDate', 'endDate'],
                        limit: recordsInPage,
                        offset: (requestedPage - 1) * recordsInPage,
                        include: [{
                            attributes: ['number', 'type'],
                            model: models.vehicles
                        }, {
                            attributes: ['nickName'],
                            model: models.drivers
                        }]
                    }).then(result => {
                        result = result.map(record => record.dataValues).map(record => {
                            record.nickName = record.driver ? record.driver.nickName : undefined
                            if (record.vehicle) {
                                record.number = record.vehicle.number
                                record.type = record.vehicle.type
                            }
                            delete record['driver']
                            delete record['vehicle']
                            return record
                        })
                        if (result.length) return (new Response(true, { transactions: result, pageCount, count }, {}))
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
    add: async (record) => {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const arrayError = []
                    await validation(record, arrayError)
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
    releaseDriver: async (id) => {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    if (!id) throw (createError.Conflict({
                        message: "error",
                        code: SERVER_ERRORS.RECORD_IS_NOT_VALID,
                    }))
                    const result = await model.update({ endDate: new Date() }, { where: { endDate: null, driverId: id } }).then(result => {
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
    releaseVehicle: async (id) => {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    if (!id) throw (createError.Conflict({
                        message: "error",
                        code: SERVER_ERRORS.RECORD_IS_NOT_VALID,
                    }))
                    const result = await model.update({ endDate: new Date() }, { where: { endDate: null, vehicleId: id } }).then(result => {
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
    }
}