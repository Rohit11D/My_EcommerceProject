const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const nodeMailer = require("nodemailer");
const crypto = require("crypto");
// Register a User

exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const {name,email,password}=req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample",
            url:"profileAvatarUrl"
        }
    });
    // const token = user.getJWTToken();
    // res.status(201).json({
        // success:true,
        // token,
        // message:"User created"
    // });
    sendToken(user,201,res);
})

// login User 
exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body;

    // check if user has given password ans email both

    if(!email||!password){
        return next(new ErrorHandler("Please Enter Email & Passwoed",400));
    }

    const user = await User.findOne({email}).select("+password"); // we cannot write password with email in{ } here password is encrypted
     
    if(!user){
        return next(new ErrorHandler("Invalid email or password!",401));  
    }

    const isPasswordMatched = await user.comparePassword(password);
console.log(isPasswordMatched);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password!",401));  
    }
// 
    // const token = user.getJWTToken();
// res.status(200).json({
    // success:true,
    // token,
    // message:"login successfull"
// });
sendToken(user,200,res);
});


// logout user
exports.logoutUser = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success:true,
        message: "Logged Out",
    });
});

// forgot password 
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    // getResetPasswaordToken
    const resetToken = user.getResetPasswordToken();
    await  user.save({validateBeforeSave:false});
//    link to send for reset password we directly not sent hash string
    // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`   this works only in case of http , local host
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `Your password reset token is :- \n\n
     ${resetPasswordUrl} \n\n if you have not requested than,ignore it `;

     try{
  await sendEmail({
     email:user.email,
     subject:`Ecommerce Password Recovery`,
     message,
  });
  res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`,
  });
     }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await  user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));
     }
});

// reset password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{
    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()},

    });

    if(!user){
        return next(new ErrorHandler("reset password token is invalid or has been expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("password does not match",400));
    }

    user.password = req.body.password;
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await  user.save();
    


 sendToken(user,200,res);

});


// get user details
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
//  after login user become authorised and its info stored in req.user from auth.js file
// so we can use it no need to take any params.
const user = await User.findById(req.user.id);
res.status(200).json({
    success:true,
    user,
 
});
});

// change password without forgot
exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    //  after login user become authorised and its info stored in req.user from auth.js
    // so we can use it no need to take any params.
    const {oldPassword,newPassword,confirmPassword} = req.body;
    const user = await User.findById(req.user.id).select("+password");
    // if we dont add ".select("+password")" then error occurs during comparePassword
  
    const isPasswordMatched = await user.comparePassword(oldPassword);
    console.log("adsfs");
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400));
    }
    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("Password does not match",401));
    }
    user.password = newPassword;
    
    await  user.save();
    


 sendToken(user,200,res);
    });

 // update profile

 exports.updateProfile = catchAsyncError(async(req,res,next)=>{
        const newUser= {
          name:req.body.name,
          email:req.body.email
        }
          //  we will add cloudinary later
        const user = await User.findByIdAndUpdate(req.user.id,newUser,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        });

      res.status(200).json({
        success:true,
        user
      });
    });

    // get all users(admin)
    exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
        const users = await User.find();
        if(!users){
            return next(new ErrorHandler("No User Found",400));
        }
        res.status(200).json({
            success:true,
            users
        })
    });

      // get single user(admin)
  exports.getSingleUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`,400));
    }
    res.status(200).json({
        success:true,
        user
    })
});


// update Role(Admin)
exports.updateRole = catchAsyncError(async(req,res,next)=>{
    const newUser= {
      name:req.body.name,
      email:req.body.email,
      role:req.body.role
    }
      //  we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.params.id,newUser,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
  res.status(200).json({
    success:true,
    user
  });
});

// delete user(Admin)

exports.deleteUser = catchAsyncError(async(req,res,next)=>{
    let user = await User.findById(req.params.id);
    // we will remove cloudinary later

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`,400));
    }
    
  await user.deleteOne();
    res.status(200).json({
        success:true,
        message:"user deleted"
    })
});
