const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const Token = require("../models/token");
const { signInSchema,signUpSchema,validate}=require("../shared/schema");
const db=require("../shared/mongo");
const { users } = require("../shared/mongo");


const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
module.exports={
    async forgotPassword(req, res){
        try{
            const user = await db.users.findOne({ email: req.body.email });
            if (!user)
            return res.status(400).send("user with given email doesn't exist");
            let token = await Token.findOne({ userId: user._id });
        
            if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
},

async resetPassword(req, res) {
    try {
        const user = await db.users.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        user.password = req.body.password;
        await user.save();
        await token.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
},


    async signIn(req, res){
        try {
            //request body validation
            const isError = await validate(signInSchema, req.body);
            if (isError) return res.status(400).json({ message: isError })
            //check user exists or not
            let user= await db.users.findOne({ email: req.body.email, active: true })
            if (!user)
                return res.status(401).json({ message: "user doesnt exists" })
                if (!user.active)
                return res.status(401).json({ message: "user is inactive" })
                //check passowrd
           const isValid = await bcrypt.compare(req.body.password,user.password)
            if (isValid) {
                delete user.password;
                
                console.log(user);
               const authToken=jwt.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
                console.log(authToken);
                res.json({ message: " user signed in successfully" , authToken });
    
            }
             else {
                res.status(401).json({ message: " email and password doesnt match" })
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while signin" })
        }
    },


    

    async signUp(req, res){
        try {
            const isError = await validate(signUpSchema, req.body)
            if (isError) return res.status(400).json({ error: isError });
          
            let user = await db.users.findOne({ email: req.body.email })
    
            if (user)
                return res.status(400).json({ message: "user already exists" })
    
            //Encrypt the password
            user=req.body.password =await bcrypt.hash(
            req.body.password, 
            await bcrypt.genSalt()
            );

            // var data = await user.save();
            //password hash
        // var hash = await bcrypt.hash(req.body.password,10);
        
        //  user = new users({
        //     name:req.body.name,
        //     email:req.body.email,
        //    password:hash, 
        // });

        // var data = await user.save();

        // res.json(data);

            delete req.body.cpassword;
    
            //insert into user collection
            user = await db.users.insertOne({...req.body, active:true, createdOn: new Date()});
            res.json({ message: "user signedup successfully!!" })
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "error while signup" })
        }
    
    
    },

  
}