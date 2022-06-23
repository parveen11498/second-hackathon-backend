const route = require("express").Router();

const {forgotPassword, resetPassword, signUp, signIn}=require("../services/auth.services")



route.post("/signup",signUp);
route.post("/password-reset",forgotPassword);
route.post("/password-reset/:userId/:token",resetPassword )
route.post("/signin", signIn);


module.exports = route;