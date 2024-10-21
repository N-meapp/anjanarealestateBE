const mongoose = require('mongoose')

const connectDb = async()=>{

      try {

        const connection = await mongoose.connect('mongodb+srv://developersnme:4MIS2DiqF1WNb7hl@anjanarealestate.pgvei.mongodb.net/')
         console.log("Mongodb database Connected!");
         
        
      } catch (error) {
        console.log(error);

      }
}

module.exports=connectDb