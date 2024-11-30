const USERS = require('../Models/userModels');
const CATEGORY = require('../Models/categoryModel');
const YOUTUBE = require('../Models/youtubeVideoModal')
const { upload } = require('../config/cloudinary');
const { cloudinary } = require('../config/cloudinary'); 
const BLOG = require('../Models/blogModel');



const categoryList = async(req, res)=>{
    
    try {

        const categoryLists = await CATEGORY.find()
        
        if(!categoryLists || categoryLists === 0){
            return res.status(404).json({message : "Category not found!"})
        }

        res.status(200).json({
            success: true,
            data: categoryLists
        });
     
        console.log( categoryLists, "category fetched successfully");
        
        
    } catch (error) {
     
        console.log("error fetching category", error);
        
        res.status(500).json({
            success: false,
            message: "errror fetching category",
            error: error.message
        });
    }

};


const deleteCategory = async(req, res)=>{
   console.log(req.query, "deleted request reveved");
   

    try {
 
       const result = await CATEGORY.deleteOne({categoryName: req.query.name});

       if(result.deletedCount === 0){
        return res.status(404).json({message: "no proprty found that catyegory!"});
       }

       res.status(200).json({
        success: true,
        message: "category deleted successfully",
       });

    } catch (error) {
       console.log("error deleting category", error);

       res.status(500).json({
        success: false,
        message: "error deleting category",
        error: error.message,
       })
       
    }

}



const addCategory = async (req, res) => {
    console.log( req.body," recieved request in add category");
    
    try {
      const { categoryName } = req.body;
  
   
      const existingCategory = await CATEGORY.findOne({ categoryName });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
  
      
      const newCategory = new CATEGORY({ categoryName });

      await newCategory.save();
  

      res.status(201).json({
        success: true,
        message: 'Category added successfully',
        data: newCategory,
      });
    } catch (error) {
      console.error("Error adding new category:", error);
      res.status(500).json({
        success: false,
        message: 'Error adding category',
        error: error.message,
      });
    }
  };



  const categoryViseListing = async (req, res) => {
    console.log(req.query, "datqqqqqqqq");
    
  try {
    const properties = await USERS.find({category: req.query.category}); 

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: 'No properties found' });
    }

    res.status(200).json({
      success: true,
      data: properties,
    });

    console.log(properties, "Properties fetched successfully");
  } catch (error) {
    console.error("Error fetching properties:", error); 
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message, 
    });
  }
};




// Function to delete property along with its associated images from Cloudinary
const deleteProperty = async (req, res) => {
  const propertyId = req.params.id;  // Assuming the propertyId is sent as a URL param

  try {
    // Find the property by ID
    const property = await USERS.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Extract the image URLs from the property
    const imageUrls = property.imageUrls;

    // Delete images from Cloudinary using their public IDs
    if (imageUrls && imageUrls.length > 0) {
      for (let imageUrl of imageUrls) {
        const publicId = extractPublicIdFromUrl(imageUrl); // Extract public ID from URL
        await cloudinary.uploader.destroy(publicId);  // Delete the image from Cloudinary
      }
    }

    // Delete the property from MongoDB
    await USERS.findByIdAndDelete(propertyId);

    res.status(200).json({
      success: true,
      message: 'Property and associated images deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message,
    });
  }
};

// Helper function to extract Cloudinary public_id from the URL
const extractPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const fileWithExtension = parts[parts.length - 1];  // Get the last part of the URL
  const publicId = fileWithExtension.split('.')[0];  // Remove file extension to get public_id
  return publicId;
};




const addPrpertyData = async(req, res) => {

  const { name, address, features, area, status, furnishedStatus, contactNumber, category, rate } = req.query;


  console.log('req.......q:',req.query);
  

    const photos = req.files.map((file)=>{
      return file.path
    })

      try {

        const newProperty = new USERS({
          name,
          address,
          features,
          area,
          status,
          furnishedStatus,
          contactNumber,
          category,
          photos, 
          rate,
        });

        await newProperty.save();

        // Send a success response
        res.status(201).json({
          success: true,
          message: 'Property data added successfully',
          data: newProperty,
        });
      } catch (error) {
        console.error('Error adding property data:', error);
        res.status(500).json({
          success: false,
          message: 'Error adding property data',
          error: error.message,
        });
      }
};




// Function to update property details along with handling new image uploads
const updateProperty = async(req, res) => {
  const { photos,name, address, features, area, status, furnishedStatus, contactNumber, category, rate} = req.query;
  const propertyId = req.params.id;

  const tempArray1 = req.files.map((file)=>{
    return file.path
  })  

  const tempArray2 = photos.filter((image)=>{
    if(image.includes('cloudinary.com')){
      return image
    }
  })

const imageArray = tempArray1.concat(tempArray2)


  try {
    // Find the property by ID
    const property = await USERS.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    

    if (name) property.name = name;
    if (address) property.address = address;
    if (features) property.features = features;
    if (area) property.area = area;
    if (status) property.status = status;
    if (furnishedStatus) property.furnishedStatus = furnishedStatus;
    if (contactNumber) property.contactNumber = contactNumber;
    if (category) property.category = category;
    if (rate) property.rate = rate;
    if(imageArray) property.photos = imageArray


    await property.save();
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });

  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message,
    });
  }
  

};


const addYoutubeVideo = async(req,res)=>{

  try {
    const { video } = req.body;

 
    const existingVideo = await YOUTUBE.findOne({video});
    if (existingVideo) {
      return res.status(400).json({ message: 'Video already exists' });
    }

    const newVideo = new YOUTUBE({ video });

    await newVideo.save();


    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: newVideo,
    });
  } catch (error) {
    console.error("Error uploading new video:", error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message,
    });
  }


}


const youtubeVideoList = async(req, res)=>{
    
  try {

      const videoLists = await YOUTUBE.find()
      
      if(!videoLists || videoLists === 0){
          return res.status(404).json({message : "Video not found!"})
      }

      res.status(200).json({
          success: true,
          data: videoLists
      });
         
      
  } catch (error) {
   
      console.log("error fetching videos", error);
      
      res.status(500).json({
          success: false,
          message: "errror fetching videos",
          error: error.message
      });
  }

};



const getPropertyCount = async (req, res) => {
  try {
    const propertyCount = await USERS.countDocuments();

    res.status(200).json({
      success: true,
      count: propertyCount,
      message: "Property count fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching property count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching property count",
      error: error.message
    });
  }
};




const getCategoryWiseCount = async (req, res) => {
  try {
    const categoryWiseCount = await USERS.aggregate([
      {
        $group: {
          _id: "$category", 
          count: { $sum: 1 } 
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: categoryWiseCount, 
      message: "Category-wise property count fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching category-wise property count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category-wise property count",
      error: error.message
    });
  }
};



const getcategoryCount = async (req, res) => {
  try {
    const categoryCount = await CATEGORY.countDocuments();

    res.status(200).json({
      success: true,
      count: categoryCount,
      message: "category count fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching category count:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category count",
      error: error.message
    });
  }
};



const deleteVideo = async(req, res)=>{
  console.log(req.params.id, "deleted request reveved");
  const id = req.params.id
  

   try {

      const result = await YOUTUBE.deleteOne({_id:id});
      console.log(result);
      

      if(result.deletedCount === 0){
       return res.status(404).json({message: "no proprty found that catyegory!"});
      }

      res.status(200).json({
       success: true,
       message: "video deleted successfully",
      });

   } catch (error) {
      console.log("error deleting video", error);

      res.status(500).json({
       success: false,
       message: "error deleting video",
       error: error.message,
      })
      
   }

}


const addBlog = async(req,res)=>{

  try {
    const { title,description, date, category} = req.body;

 
    const existingBlog = await BLOG.findOne({title});
    if (existingBlog) {
      return res.status(400).json({ message: 'blog already exists' });
    }

    const newBlog = new BLOG({ title:title, description:description,date:date,category });

    await newBlog.save();


    res.status(201).json({
      success: true,
      message: 'Blog uploaded successfully',
      data: newBlog,
    });
  } catch (error) {
    console.error("Error uploading new blog:", error);
    res.status(500).json({
      success: false,
      message: 'Error uploading blog',
      error: error.message,
    });
  }


}

const getBlogList = async(req, res)=>{
    
  try {

      const blogLists = await BLOG.find()
      
      if(!blogLists || blogLists === 0){
          return res.status(404).json({message : "blog not found!"})
      }

      res.status(200).json({
          success: true,
          data: blogLists
      });
         
      
  } catch (error) {
   
      console.log("error fetching blogs", error);
      
      res.status(500).json({
          success: false,
          message: "errror fetching blogs",
          error: error.message
      });
  }

};

const deleteBlog= async(req, res)=>{
  console.log(req.params.id, "deleted request reveved");
  const id = req.params.id

   try {

      const result = await BLOG.deleteOne({_id:id});
      console.log(result);
      

      if(result.deletedCount === 0){
       return res.status(404).json({message: "no proprty found that catyegory!"});
      }

      res.status(200).json({
       success: true,
       message: "blog deleted successfully",
      });

   } catch (error) {
      console.log("error deleting blog", error);

      res.status(500).json({
       success: false,
       message: "error deleting blog",
       error: error.message,
      })
      
   }

}


module.exports = {
      categoryList,
      deleteCategory,
      addCategory,
      categoryViseListing,
      deleteProperty,
      updateProperty,
      addPrpertyData,
      addYoutubeVideo,
      youtubeVideoList,
      getPropertyCount,
      getCategoryWiseCount,
      getcategoryCount,
      deleteVideo,
      addBlog,
      getBlogList,
      deleteBlog
    }

