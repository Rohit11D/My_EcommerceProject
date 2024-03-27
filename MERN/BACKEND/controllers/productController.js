const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
// create product -- Admin
exports.createProduct = catchAsyncError(async(req,res,next)=>{
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
        productCount
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