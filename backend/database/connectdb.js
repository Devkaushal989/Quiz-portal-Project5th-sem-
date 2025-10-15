const mongoose = require('mongoose');

require("dotenv").config();

const db = process.env.DATABASE;

const mydb = mongoose.connect(db).then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("MongoDB connection error:", err.message);

});

module.exports=mydb;    