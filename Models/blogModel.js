const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({


       title:{
           type: String,
           required:true
       },
       description:{
           type: String,
           required:true
       },
       date:{
        type:Date,
        required:true
       },
       category:{
        type:String,
        required:true
       }

})


const blog = mongoose.model('blog', blogSchema)
module.exports = blog