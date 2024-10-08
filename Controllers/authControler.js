const ADMINAUTH = require('../Models/adminAuthModel')


const doLogin = async(req, res)=>{
         
    console.log("receved log reqqq");
    
    try {

        const result = await ADMINAUTH.findOne({
            userName:req.body.username,
            password: req.body.password
        })

        if(result){
            res.status(200).json({
                success: true,
                message: "login successfull"
            })
        }
        else{
            res.status(404).json({
               success: false,
               message: "Invalid credential"
            })
        }

    } catch (error) {

        console.log("error deleting category", error);
       
        res.status(500).json({
            message: "error login",
            error:  error                                                                                                                                                       
        })
      
    }

}

module.exports = { doLogin };