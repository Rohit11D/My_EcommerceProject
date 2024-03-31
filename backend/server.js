const { config } = require("process");
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down server due to Uncaught Exception`);
});
// console.log(rk);
// connecting database
connectDatabase();
// config
dotenv.config({path:"BACKEND/config/config.env"});

const port = process.env.PORT;
const server = app.listen(port,()=>{
console.log(`server started on http: // localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.messagge}`);
    console.log(`Shutting down server due to unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
});