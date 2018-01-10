/** Modules dependencies **/
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Pawel Pluskota sprawozdanie 1'});
});

module.exports = router;
