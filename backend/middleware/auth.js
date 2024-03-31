const catchAsyncErrors  = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhander");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// give accsess only when login for user
exports.isAuthenticatedUser = catchAsyncErrors( async(req,res,next)=>{
    const {token } = req.cookies;
     if(!token){
        return next(new ErrorHandler("Please login to access tthis resource",401));
     }

     const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    
    req.user =  await User.findById(decodedData.id);
    
    next();
});

//  for admin
exports.authorizeRoles = (...roles) =>{
   
    return (req,res,next)=>{
     
        if(!roles.includes(req.user.role)){
         return next(new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resource`,
                403));
        }
        next();
    };

};
