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
       getPropertyCount,
       getCategoryWiseCount
     } = require('../Controllers/adminController')

const { doLogin } = require('../Controllers/authControler')

//category route
router.get('/categoryList', categoryList);
router.delete('/deleteCategory', deleteCategory);
router.post('/addCategory', addCategory);

//property route
router.get('/categoryViseListing', categoryViseListing);
router.delete('/deleteProperty/:id', deleteProperty);
router.post('/addPrpertyData', addPrpertyData);
router.put('/updateProperty:id', updateProperty);
router.get('/getPropertyCount', getPropertyCount);
router.get('/getCategoryWiseCount', getCategoryWiseCount);

//login rout
router.post('/adminLogin', doLogin);



// router.get('/testing', (req, res)=>{
//     console.log(req.body, "reveved testing reqqq");
    
// })


module.exports = router;