const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// create schema

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter User Name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[4,"Name should have at least 5 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Email Address"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a Valid Email"]
    },
    password:{
        type:String,
        require:[true,"Please Enter Your Password"],
        minLength:[4,"Password should have at least 5 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date
    

});
// to hash password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password =  await bcrypt.hash(this.password,10);
})

// to give power to admin after login or to login
// JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
};
userSchema.methods.comparePassword = async function(enteredPassword){
return await bcrypt.compare(enteredPassword,this.password);
}
// generating token for reset password
userSchema.methods.getResetPasswordToken = function(){
// generating token
const resetToken = crypto.randomBytes(20).toString("hex");

// Hashing and add resetPasswordToken to userSchema
this.resetPasswordToken = crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

return resetToken;
};

module.exports = mongoose.model("User",userSchema);
