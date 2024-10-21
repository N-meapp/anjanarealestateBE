const express = require('express')
const router = express.Router()

const { 
       categoryList,
       deleteCategory,
       addCategory,
       categoryViseListing,
       deleteProperty,
       addPrpertyData,
       updateProperty,
       addYoutubeVideo,
       youtubeVideoList,
     } = require('../Controllers/adminController')

const { doLogin } = require('../Controllers/authControler');
const uploadsMulter = require('../config/cloudinary');

//category route
router.get('/categoryList', categoryList);
router.delete('/deleteCategory', deleteCategory);
router.post('/addCategory', addCategory);

//property route
router.get('/categoryViseListing', categoryViseListing);
router.delete('/deleteProperty/:id', deleteProperty);
router.post('/addPropertyData',uploadsMulter,addPrpertyData);

router.post('/updateProperty/:id',uploadsMulter, updateProperty);
router.post('/add-video',addYoutubeVideo)
router.get('/videoList',youtubeVideoList)
//login rout
router.post('/adminLogin', doLogin);

// router.get('/testing', (req, res)=>{
//     console.log(req.body, "reveved testing reqqq");
     
// })


module.exports = router;