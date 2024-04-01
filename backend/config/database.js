const mongoose = require("mongoose");
const dotenv = require("dotenv");

// config
dotenv.config({path:"backend/config/config.env"});


// connecting mongodb
const connectDatabase=()=>{
mongoose.connect(process.env.DB_URL).then(
    (data)=>{
        console.log(`mongodb connected with server: ${data.connection.host}`);
    }
)
// .catch((err)=>{            //no need to use catch here bz we used "Unhandled Promise Rejection" in server.js
    // console.log("error");
// });
}

module.exports = connectDatabase;