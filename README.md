# flight-api
This is a API to get the Flight Detail. This API can be use for:
1. Get Today Flight
2. Get All Flight By Airlinecode
3. Post New Flight Data
4. Edit Flight Data
5. Delete Flight Data
In this API, I'm using a JSON file as a Dummy File and to save the flight details. 

## Installation
1. You need to clone this Repository (master)
```bash
git clone https://github.com/exzone97/flight-api.git
```
2. Go to flight-api directory and install all dependencies.
```bash
npm install
```

## Start
1. Go to flight-api directory and start server.
```bash
npm start
```
2. You can open this API locally using http://localhost:3000/
3. If it successfully start there will be a text say "Flight API, Welcome to Flight API"

## Route
1. ("/") Index Route

This is only a index route and only return a view with text Flight API

2. ("/flights") Flight Route

This route used for Flight API (CRUD)

### Flight Route
1. Get All Flight That Have Arrival Time Today
- Using Method GET
- URL = "http://localhost:3000/flights/"
- Return = 
```json
{
  "status":"OK",
  "messages":"",
  "data":[
    {
      "id":1,
      "flightNumber":"EK001",
      "departurePort":"INA",
      "arrivalPort":"SYD",
      "departureTime":"2020-06-10T09:00:23Z",
      "arrivalTime":"2020-08-22T10:25:23Z"
    }
  ]
}
```
2. Get All Flight That Have Airline Code as a Parameter
- Using Method GET
- URL = "http://localhost:3000/flights/:airlaneCode". Example, "http://localhost:3000/flights/XC"
- Return OK = 
```json
{
  "status":"OK",
  "messages":"",
  "data":[
    {
      "id":3,
      "flightNumber":"XC737",
      "departurePort":"NYC",
      "arrivalPort":"SYD",
      "departureTime":"2020-06-10T09:00:23Z",
      "arrivalTime":"2020-08-24T10:25:23Z"
    }
  ]
}
```
- Return ERROR = 
```json
{
  "status":"ERROR",
  "messages":"Flight Not Found",
  "data":[]
}
```
3. Post New Flight Detail
- Using Method POST
- URL = "http://localhost:3000/flights/"
- Body = {
    flightNumber,
    departurePort,
    arrivalPort,
    departureTime,
    arrivalTime
}
- Return OK =
```json
{
    "status": "OK",
    "messages": "Success Add Flight Data",
    "data": {
        "id": 4,
        "flightNumber": "QF400",
        "departurePort": "INA",
        "arrivalPort": "SYD",
        "departureTime": "2020-06-10T09:00:23Z",
        "arrivalTime": "2020-08-22T10:25:23Z"
    }
}
```
- Return ERROR = All data cannot be empty.
```json
{
    "status": "ERROR",
    "messages": "Data Cannot Be Empty flightNumber",
    "data": []
}
```

4. Update Flight Detail
- Using Method PATCH
- URL = "http://localhost:3000/flights/:id". ID is the record ID.
- Body = {
    flightNumber,
    departurePort,
    arrivalPort,
    departureTime,
    arrivalTime
}
- Return OK = 
```json
{
    "status": "OK",
    "messages": "Success Update Flight Data",
    "data": {
        "id": 4,
        "flightNumber": "AA124",
        "departurePort": "ID",
        "arrivalPort": "SYD",
        "departureTime": "2020-06-10T09:00:23Z",
        "arrivalTime": "2020-08-22T10:25:23Z"
    }
}
```
- Return ERROR = Parameter Doest Not Exist
```json
{
    "status": "ERROR",
    "messages": "Flight Does Not Exist",
    "data": []
}
```
- Return ERROR = All data cannot be empty
```json
{
    "status": "ERROR",
    "messages": "Data Cannot Be Empty departurePort",
    "data": []
}
```
5. Delete Flight Detail
- Using Method DELETE
- URL = ""http://localhost:3000/flights/:id". ID is the record ID.
- Return OK = 
```json
{
    "status": "OK",
    "messages": "Flight Removed.",
    "data": [
        {
            "id": 1,
            "flightNumber": "EK001",
            "departurePort": "INA",
            "arrivalPort": "SYD",
            "departureTime": "2020-06-10T09:00:23Z",
            "arrivalTime": "2020-08-22T10:25:23Z"
        }
    ]
}
```
- Return ERROR = 
```json
{
    "status": "ERROR",
    "messages": "Flight Does Not Exist",
    "data": []
}
```
## For Testing I Suggest To Use Postman
I'm using the postman because it easy to use and will display what we wanted. Also we can enter the body that used for POST and UPDATE Route. I have save some Postman Testing at Folder Postman.

## For Production
Production need a database to save the data of the API. This API not handle it. But if we need to do the production from this Code we need to change several part.
1. We need to create connection to the database at index.js and we need to start that connection when the Project Start.
2. We need to create a database and create the table with all column we need.
3. In Flight Route file we need to change the getFlightData() and saveFlightData(data) because, it only write and read data from JSON file.
4. For every route at flight route we need SQL to process data like Create, Update, Insert and Delete

*ps. I suggest using ORM Framework like Sequelize ORM (https://sequelize.org/) to maintain the API like Flight API. Because with framework we can create a model, migration, seed and set the relations of the table.