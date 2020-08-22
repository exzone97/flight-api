// Import Require Module
let express = require('express');
let fs = require('fs');
let router = express.Router();

router.use('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'PUT, GET, POST, DELETE, PATCH, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Function to get flight data from file and parse it to json.
 */
const getFlightData = () => {
    const jsonData = fs.readFileSync('flight.json')
    return JSON.parse(jsonData)
}

/**
 * Function that use to get Date from ISOString Date.
 * @param {*} ISOString (ex. "2020-08-22T10:25:23Z")
 * return: date from param (ex. "2020-08-22")
 */
function getDateFromISOString(ISOString) {
    // Use split to get date from isostring date
    return ISOString.split('T')[0];
}
/**
 * Function to get Subset from a Flight Number
 * @param {*} flightNumber 
 * return subset from a flight number
 */
function getSubsetFlightNumber(flightNumber) {
    return flightNumber.substring(0, 2)
}
/**
 * Function to get all flight with subset
 * @param {*} subset 
 */
function getFlightWithSubset(subset) {
    let flights = getFlightData().filter(function (flight) {
        return getSubsetFlightNumber(flight.flightNumber).toLowerCase() == subset;
    })
    return flights
}
/**
 * Function to get all flight has arrival date = today.
 * Return: JSON contain all flight that has arrival date = today
 */
function getFlightArrivalToday() {
    let todayDate = new Date();
    let todayDateISOString = todayDate.toISOString();
    let todayDateString = getDateFromISOString(todayDateISOString);
    let flights = getFlightData().filter(function (flight) {
        return getDateFromISOString(flight.arrivalTime) == todayDateString
    })
    return flights
}

/**
 * Router get / will return JSON for every flight that has arrivaltime today.
 * If there any flights will return JSON but if there no flight will return status 404 - Not Found
 */
router.get('/', async function (req, res, next) {
    try {
        let flights = getFlightArrivalToday();
        if (flights.length > 0) {
            res.status(200).json({
                'status': 'OK',
                'messages': "",
                'data': flights
            })
        } else {
            res.status(404).json({
                'status': 'ERROR',
                'messages': 'Flight Not Found',
                'data': []
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            'status': 'ERROR',
            'messages': err.messages,
            'data': []
        })
    }
});

/**
 * Route to get all flight that have airlinecode.
 */
router.get('/:airlineCode', async function (req, res, next) {
    try {
        // Get Parameter and set the parameter to lower case
        let airlinecode = req.params.airlineCode.toLowerCase();
        let flights = getFlightWithSubset(airlinecode)
        if (flights.length > 0) {
            res.status(200).json({
                'status': 'OK',
                'messages': "",
                'data': flights
            })
        } else {
            res.status(404).json({
                'status': 'ERROR',
                'messages': 'Flight Not Found',
                'data': []
            })
        }
    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': err.messages,
            'data': []
        })
    }
});

module.exports = router;