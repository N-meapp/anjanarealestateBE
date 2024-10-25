const mongoose = require('mongoose');


const userSchema = mongoose.Schema({


       name:{
           type: String,
           required:true
       },

       address:{
        type:String,
        required:true
       },

       features:{
        type :Object,
       },

        area:{
            type: String,
            required:true
        },
 
        status:{
            type: String,
            required:true
        },

        furnishedStatus:{
            type: String,
            required:true
        },

        contactNumber:{
            type: Number,
            required:true
        },

        category:{
            type: String,
            required:true
        },

        photos:{
            type: [String],
            required:true
        },

        rate:{
            type: Number,
            required:true
        },

})


const users = mongoose.model('users', userSchema)
module.exports=users