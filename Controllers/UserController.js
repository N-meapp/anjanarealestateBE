const USERS = require('../Models/userModels');




const PropertyList = async (req, res) => {
    console.log("datttaaaaa");
    
  try {
    const properties = await USERS.find().limit(6); 

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


const allPropertyList = async (req, res) => {
    console.log("datttaaaaa");
    
  try {
    const properties = await USERS.find(); 

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




const categoryPropertyList = async (req, res) => {
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





const searchProperty = async (req, res) => {
  try {

    const { name, category } = req.body;

 
    const query = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };  
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }


    const properties = await USERS.find(query);

 
    if (properties.length > 0) {
      res.status(200).json({
        success: true,
        data: properties,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No properties found matching the search criteria',
      });
    }
  } catch (error) {
    console.error('Error searching properties:', error);

    res.status(500).json({
      success: false,
      message: 'Error searching properties',
      error: error.message,
    });
  }
};







module.exports = { PropertyList, allPropertyList, categoryPropertyList, searchProperty };
