const jwt=require("jsonwebtoken");
const log=require("./log")

module.exports={
    //token middlewrae
    validateToken:((req,res,next)=>{
        //req.headers? next():403
        if(req.headers && req.headers.authorization){
            const [tokenType, token]=req.headers.authorization.split(" ");
            // console.log(tokenType,token);
           
            if(tokenType==="Bearer" && token){
                try{
                    req.user=jwt.verify(token, process.env.JWT_SECRET);
                    // console.log(currentUser);
                    next();
                }catch(err){
                    console.error(err.message)
                    res.status(403).json({message: "user is not authorized"})
                }
        
             }else{
                res.status(403).json({message: "user is not authorized"})
            }
        }else{
            res.status(403).json({message: "user is not authorized"})
        }
        
    }),
    logging:(req,_,next)=>{
        log(`$(req.url) ${req.method}`);
        next();
    
    },
    maintenance:(_,res,next)=>
    process.env.IS_MAINTENANCE ==="true" ? res.send("site is under maintenance"):next()
    ,
};