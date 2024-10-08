const mongoose = require('mongoose');


const adminAuthSchema = mongoose.Schema({

       userName:{
           type: String,
           required:true
       },
       password:{
        type: String,
        required:true
    },

})


const admins = mongoose.model('admins', adminAuthSchema)
module.exports = admins