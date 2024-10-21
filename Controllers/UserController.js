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
    console.log(properties, "vvvvvvvvvvv   datttaaaaa");

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
    console.log(req.query.category, "datqqqqqqqq");
    
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
  const query = req.query.query

  console.log(query, "hahahahahaha");

  const result = await USERS.find({name:{ $regex: query, $options: 'i' }})

  if(result.length > 0){
    res.status(200).json({
      success: true,
      data: result
    })
  }else{
    res.status(404).json({
      success: false,
      message: "data not found!"
    })
  }
  
  
} catch (error) {
  console.error("Error fetching properties:", error); 
  res.status(500).json({
    success: false,
    message: 'Error fetching properties',
    error: error 
  });
}








  // try {
  //   // Log the request body to ensure data is being sent correctly
  //   console.log('Incoming request body:', req.body);
  
  //   const { name } = req.body.name; // Extract name from request body
  //    console.log(name, "jjjjjjjjjjj");
     
  //   const query = {}; // Initialize query object

  //   // If name is provided, search both 'name' and 'category'
  //   if (name) {
  //     query.$or = [
  //       { name: { $regex: name, $options: 'i' } },
  //       { category: { $regex: name, $options: 'i' } }
  //     ];

  //     // Log the constructed query for debugging
  //     console.log('Constructed query:', query);
  //   }

  //   // Fetch properties matching the query
  //   const properties = await USERS.find(query);

  //   // If properties are found, return them
  //   if (properties.length > 0) {
  //     res.status(200).json({
  //       success: true,
  //       data: properties,
  //     });
  //   } else {
  //     // Log the case where no matching properties were found
  //     console.log('No properties found matching the query');
  //     res.status(404).json({
  //       success: false,
  //       message: 'No properties found matching the search criteria',
  //     });
  //   }
  // } catch (error) {
  //   // Log the error for debugging purposes
  //   console.error('Error searching properties:', error);

  //   res.status(500).json({
  //     success: false,
  //     message: 'Error searching properties',
  //     error: error.message,
  //   });
  // }
};





const singleProperty = async(req, res)=>{

 
    const {propertyId} = req.query;
    console.log(propertyId, "dattaaaaaaaaa");
  try {
     

    const singleData = await USERS.findOne({_id: propertyId})

    if (!singleData) {
      return res.status(404).json({ 
        message: 'Property not found',
        success:false
       })
    }

    res.status(200).json({
      data:singleData,
      success:true,
      message:"data fetching successfully"
    })
    
  } catch (error) {

    console.error('Error fetching property details:', error);
    res.status(500).json({
      message: 'Server error fetching property details',
      error: error.message,
    });
    
  }






module.exports = { PropertyList, allPropertyList, categoryPropertyList, searchProperty, singleProperty };
