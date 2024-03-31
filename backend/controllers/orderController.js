const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
// create new order
exports.newOrder = catchAsyncError(async(req,res,next)=>{
const{
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
} = req.body;
console.log( shippingInfo);
const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user:req.user
});
res.status(201).json({
    success:true,
    order
});
});

// get single order

exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    .populate("user","name email");
    //(populate) by using id of user given in user field of order model, it returns the name and email of user

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    res.status(200).json({
        success:true,
        order
    });
})


// get Orders of logged in user

exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id})

    if(!orders){
        return next(new ErrorHandler("Order not found with this Id",404));
    }

    res.status(200).json({
        success:true,
        orders
    });
})

// get all orders -- Admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find()

    if(!orders){
        return next(new ErrorHandler("Order not found with this Id",4));
    }
let totalAmount=0;
orders.forEach((order)=>{
totalAmount += order.totalPrice;
});
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    });
})


// update order status -- Admin

exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this Id",4));
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product,order.quantity);
    });
    
    order.orderStatus = req.body.status;
    if(req.body.status==="Delivered"){
    order.deliveredAt = Date.now(); 
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    });
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;
    await product.save({validateBeforeSave:false});

}

//delete order -- Admin
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",4));
    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success:true,
    });
})

