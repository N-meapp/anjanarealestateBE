const mongoose = require('mongoose');


const youtubeSchema = mongoose.Schema({


       video:{
           type: String,
           required:true
       },

})


const youtube = mongoose.model('youtube', youtubeSchema)
module.exports = youtube