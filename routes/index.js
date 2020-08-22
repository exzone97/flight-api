// Import Require Module
let express = require('express');
let router = express.Router();

router.use('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'PUT, GET, POST, DELETE, PATCH, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* GET */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Flight API' });
});

module.exports = router;