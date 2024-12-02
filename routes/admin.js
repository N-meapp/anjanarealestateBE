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
       getPropertyCount,
       getCategoryWiseCount,
       deleteVideo,
       addBlog,getBlogList,deleteBlog
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
router.post('/addPrpertyData', addPrpertyData);
router.put('/updateProperty:id', updateProperty);
router.get('/getPropertyCount', getPropertyCount);
router.get('/getCategoryWiseCount', getCategoryWiseCount); 
router.post('/updateProperty/:id',uploadsMulter, updateProperty);

  
// video route 
router.post('/add-video',addYoutubeVideo)
router.get('/videoList',youtubeVideoList)
router.delete('/deleteVideo/:id',deleteVideo)

// blog route
router.post('/add-blog',addBlog)
router.get('/blog-list',getBlogList)
router.delete('/delete-blog/:id',deleteBlog) 

//login route
router.post('/adminLogin', doLogin);

// router.get('/testing', (req, res)=>{
//     console.log(req.body, "reveved testing reqqq");
     
// })


module.exports = router;



 