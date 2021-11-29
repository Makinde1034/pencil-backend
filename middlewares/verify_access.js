const jwt = require("jsonwebtoken");


exports.verify_access = (req,res,next) => {
    const token = req.headers["x-access-token"]

    if(!token){
        res.status(401).json({
            msg : "No token found"
        })
    }

    jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
        if(err){
            res.status(401).json({
                msg : "Invalid token"
            })
        }

        req.user_id = decoded.user_id
      
        next()
    })
}

