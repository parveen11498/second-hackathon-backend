const joi = require("joi");
module.exports={
    


    async validate(schema, data) {
        try {
            await schema.validateAsync(data);
            return false;
    
        } catch ({ details: [error] }) {
            return error.message
    
        }
    
    },
    
    signInSchema : joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$")).required(),
    }),


    customerSchema:joi.object({
        cusName: joi.string().required(),
        cusMobile: joi.number().required(),
        cusEmail:joi.string().email().required(),
        body:joi.string().required(),
        feedback:joi.string().required()
    }),
    
    signUpSchema : joi.object({
        firstName: joi.string().min(2).required(),
        lastName: joi.string().required(),
        mobile: joi.number().required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$")).required(),
        cpassword: joi.ref("password"),
        role:joi.string().required()
    
    }),

    postSchema:joi.object({
        title: joi.string().required(),
        body: joi.string().required()
    }),
    
}