const USERS = require('../Models/userModels');
const CATEGORY = require('../Models/categoryModel');
const { upload } = require('../config/cloudinary');
const { cloudinary } = require('../config/cloudinary'); 


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
    console.log( req.body," receved request in add category");
    
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




const addPrpertyData = (req, res) => {
  upload.array('images', 5)(req, res, async function (err) {  
    if (err) {
      return res.status(500).json({ error: 'File upload failed', details: err });
    }

    try {

      const { name, address, features, area, status, furnishedStatus, contactNumber, category, rate } = req.body;

      const imageUrls = req.files.map(file => file.path); 

      const newProperty = new Property({
        name,
        address,
        features,
        area,
        status,
        furnishedStatus,
        contactNumber,
        category,
        imageUrls,  // Save multiple image URLs
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
  });
};




// Function to update property details along with handling new image uploads
const updateProperty = (req, res) => {
  const propertyId = req.params.id;  // Assuming you send propertyId as a URL param

  upload.array('images', 5)(req, res, async function (err) {  // 'images' field for file upload, max 5 files
    if (err) {
      return res.status(500).json({ error: 'File upload failed', details: err });
    }

    try {
      // Find the property by ID
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }

      // Update the fields from request body if provided
      const { name, address, features, area, status, furnishedStatus, contactNumber, category, rate } = req.body;

      if (name) property.name = name;
      if (address) property.address = address;
      if (features) property.features = features;
      if (area) property.area = area;
      if (status) property.status = status;
      if (furnishedStatus) property.furnishedStatus = furnishedStatus;
      if (contactNumber) property.contactNumber = contactNumber;
      if (category) property.category = category;
      if (rate) property.rate = rate;

      // If new images are uploaded, replace the old image URLs
      if (req.files && req.files.length > 0) {
        const newImageUrls = req.files.map(file => file.path);
        property.imageUrls = newImageUrls;  // Replace old image URLs with new ones
      }

      // Save the updated property details to the database
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
  });
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




module.exports = {
      categoryList,
      deleteCategory,
      addCategory,
      categoryViseListing,
      deleteProperty,
      updateProperty,
      addPrpertyData,
      getPropertyCount,
      getCategoryWiseCount,
      getcategoryCount
    }







