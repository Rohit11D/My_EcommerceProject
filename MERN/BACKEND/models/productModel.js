const mongoose = require("mongoose");

// create schema
const productSchema = new mongoose.Schema({
   name:{
    type:String,
    required:[true,"Please Enter Product Name"],
    trim:true
   },
   description:{
    type:String,
    required:[true,"Please Enter Product Description"]
   } ,
   price:{
    type:Number,
    required:[true,"Please Enter Product Price"],
    maxLength:[10,"Price cannot exceed 10 characters"]
   },
   rating:{
    type:Number,
    required:true,
    default:0
   },
   images:[{   //images is array of objects as we put more than one image
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
   }],
   category:{
    type:String,
    required:[true,"Please Enter Product Category"]
   },
   stock:{
    type:Number,
    required:[true,"Please Enter Product Stock"],
    maxlength:[4,"Product Stock cannot exceed 4 characters"],
    default:1
   },
   numOfReviews:{
    type:Number,
    default:0
   },
   reviews:[
    {
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }
   ],
   createdAt:{
    type:Date,
    default:Date.now()
   }
});


module.exports = mongoose.model("Product",productSchema);