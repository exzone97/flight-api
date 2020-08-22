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