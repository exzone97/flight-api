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
 * Function to write the json file
 * @param {*} data 
 */
const saveFlightData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('flight.json', stringifyData)
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

/**
 * Route for post data.
 */
router.post('/', async function (req, res, next) {
    try {
        let flightData = getFlightData()
        let lastId = flightData[flightData.length - 1].id
        let newId = lastId + 1
        const {
            flightNumber,
            departurePort,
            arrivalPort,
            departureTime,
            arrivalTime
        } = req.body;
        let newFlight = {
            id: newId,
            flightNumber,
            departurePort,
            arrivalPort,
            departureTime,
            arrivalTime
        }
        let emptyData = [];
        if (flightNumber == null || flightNumber == "") {
            emptyData.push("flightNumber")
        }
        if (departurePort == null || departurePort == "") {
            emptyData.push("departurePort")
        }
        if (arrivalPort == null || arrivalPort == "") {
            emptyData.push("arrivalPort")
        }
        if (departureTime == null || departureTime == "") {
            emptyData.push("departureTime")
        }
        if (arrivalTime == null || arrivalTime == "") {
            emptyData.push("arrivalTime")
        }
        if (emptyData.length > 0) {
            return res.status(401).json({
                'status': 'ERROR',
                'messages': "Data Cannot Be Empty " + emptyData.toString(),
                'data': []
            })
        }
        else {
            flightData.push(newFlight)
            saveFlightData(flightData)
            return res.status(201).json({
                'status': 'OK',
                'messages': "Success Add Flight Data",
                'data': newFlight
            })
        }
    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': err.message,
            'data': [],
        })
    }
});

/**
 * Route to Update the data by the ID of the record
 */
router.patch('/:id', async function (req, res, next) {
    try {
        const flightId = req.params.id;
        const {
            flightNumber,
            departurePort,
            arrivalPort,
            departureTime,
            arrivalTime
        } = req.body;
        let updatedFlight = {
            id: parseInt(flightId),
            flightNumber,
            departurePort,
            arrivalPort,
            departureTime,
            arrivalTime
        }
        let flightData = getFlightData();
        const findExist = flightData.find(flight => flight.id == flightId)
        // check if the id exist or not
        if (!findExist) {
            // if not exist then return status error
            return res.status(409).json({
                'status': 'ERROR',
                'messages': 'Flight Does Not Exist',
                'data': []
            })
        }
        else {
            // if exist then update the data.
            const flightFilter = flightData.filter(flight => flight.id != flightId)
            flightFilter.push(updatedFlight)
            saveFlightData(flightFilter)
            return res.status(201).json({
                'status': 'OK',
                'messages': "Success Update Flight Data",
                'data': updatedFlight
            })
        }
    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': err.message,
            'data': [],
        })
    }
});

/**
 * Route to delete the exist flight data by record ID
 */
router.delete('/:id', async function (req, res, next) {
    try {
        const flightId = req.params.id;
        let flightData = getFlightData();
        const filterFlight = flightData.filter(flight => flight.id != flightId)
        const removedFlight = flightData.filter(flight => flight.id == flightId)
        // Check if Flight is Exist
        if (flightData.length === filterFlight.length) {
            return res.status(409).json({
                'status': 'ERROR',
                'messages': 'Flight Does Not Exist',
                'data': []
            })
        }
        else {
            saveFlightData(filterFlight);
            return res.status(201).json({
                'status': 'OK',
                'messages': "Flight Removed.",
                'data': removedFlight
            })
        }
    } catch (err) {
        res.status(400).json({
            'status': 'ERROR',
            'messages': err.message,
            'data': [],
        })
    }
});
module.exports = router;