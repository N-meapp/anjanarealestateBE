var express = require('express');
var router = express.Router();

const { 
    PropertyList,
    allPropertyList,
    categoryPropertyList,
    searchProperty,
    singleProperty,
 } = require('../Controllers/UserController')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/PropertyList', PropertyList)
router.get('/allPropertyList', allPropertyList)
router.get('/categoryPropertyList', categoryPropertyList)
router.get('/singleProperty', singleProperty)
router.get('/search', searchProperty)
 


module.exports = router;