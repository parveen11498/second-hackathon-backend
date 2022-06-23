
const {config}=require("dotenv")
const express =require("express");

const {log, middleware, mongo}=require("./shared");

const {authRoutes, passwordReset, customerRoutes ,postRoutes}=require("./routes")
const cors=require("cors")

const app=express();
config();

(async ()=>{
    try{
        await mongo.connect();

        app.use(express.json());
        app.use(cors());
        app.use(middleware.maintenance)
        // app.use("/api/passwordReset", passwordReset)
        app.use(middleware.logging)

        //authRoutes
        app.use("/auth", authRoutes);
         
        //auth middleware
        app.use(middleware.validateToken)

    //all other routes
        app.use("/customers", customerRoutes)
        app.use("/posts", postRoutes)


        app.listen(process.env.PORT, () => {
            log(`server listening at port ${process.env.PORT}`);
        })
    }catch(err){
        log(`error while creating server -${err.message}`);
        process.exit();
    }
   
})()






