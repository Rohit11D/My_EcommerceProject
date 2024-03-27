const { replaceOne } = require("../models/productModel");

class ApiFeatures{
    constructor(query,queryStr){  // queryStr is a keyword like"samosa" and query is like find in get function in product controller
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"//i here means case insencitive
            }
        }:{};
        this.query = this.query.find({...keyword});
        return this;
    }


filter(){
    const queryCopy = {...this.queryStr};
console.log(queryCopy);
    // remove some fields for category
    const removeFields = ["keyword","page","limit"];
    removeFields.forEach(key=>delete queryCopy[key]);
   
    // filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|gte)\b/g,key =>`$${key}`)
    this.query = this.query.find(JSON.parse(queryStr));
    console.log(queryStr);
    return this;
}

pagination(resultsPerPage){
    const currentPage = Number(this.queryStr.page)||1;//50 products 10 products each
    const skip = resultsPerPage*(currentPage-1);
    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
}
};
module.exports=ApiFeatures;