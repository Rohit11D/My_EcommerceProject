const express = require("express");
const {getAllProducts,createProduct,getProductDetails,updateProduct,deleteProduct} = require("../controllers/productController");

 const router = express.Router();
// creating a route
 router.route("/products").get(getAllProducts);

router.route("/product/new").post(createProduct);

router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);

// router.route("/product/:id").delete(deleteProduct);

module.exports = router;