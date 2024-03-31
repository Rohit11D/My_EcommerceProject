const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
// create product -- Admin
exports.createProduct = catchAsyncError(async(req,res,next)=>{

     req.body.user = req.user.id;//required for who created a product

    const product = await Product.create(req.body);
    
    res.status(201).json({
        success:true,
        product,
        message:"Product created"
    });
    
   
});

// get all products
exports.getAllProducts = catchAsyncError(async(req,res,next)=>{
   const resultsPerPage = 5;
   const productCount = await Product.countDocuments();

   const apiFeature = new ApiFeatures(Product.find(),req.query)
   .search().filter().pagination(resultsPerPage);
    // const product = await Product.find(); 
    const product = await apiFeature.query
    res.status(200).json({
        success:true,
        product,
        productCount,
        message:"Route is working fine"
    });
});
// get product detail by ID --Admin
exports.getProductDetails = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    //  return res.satus(500).json({
            // success:false,
            // message:"Product not found"
        // })
    }
    res.status(200).json({
        success:true,
        product,
       
    })
});

// update product --Admin
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    product = await Product.findByIdAndUpdate(req.params.id,
        req.body,{new:true,useFindAndModify:false,
        runValidators:true});

    res.status(200).json({
        success:true,
        product,
        message:"product updated"
    })
});

// delete product --Admin

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    
  await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"product deleted"
    })
});

// create New review or Update the review

exports.createProductReview = catchAsyncError(async (req,res,next)=>{

    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id, //req.user._id  id of user who logged in
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    console.log(productId);
    const isReviewed = product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());
    if(isReviewed){
          product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString())
          {  rev.rating = rating,
            rev.comment = comment
          }
          });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
  let avg  = 0;
   product.reviews.forEach(rev=>{
        avg += rev.rating;

    })/product.numOfReviews;

    product.ratings = avg;

    await product.save({validateBeforeSave:false});
res.status(200).json({
    success:true
})
});

// get all reviews of a product
exports.getAllReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
   
    if(!product){
        return(next(new ErrorHandler("Product not found",400)));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
})

// delete Review
exports.deleteReview = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return(next(new ErrorHandler("Product not found",400)));
    }
    console.log(req.query.productId);
    console.log(req.query.id);
    const reviews = product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString());

    let avg  = 0;
 reviews.forEach(rev=>{
         avg += rev.rating;
     })/product.numOfReviews;

    const ratings = avg;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
       reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        message:"Review deleted successfully"
    });
})