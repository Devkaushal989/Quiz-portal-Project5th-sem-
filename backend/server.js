const express =require("express");
// const cors=require("cors");
const app=express();

require("./database/connectdb");
require("dotenv").config();
const port = process.env.PORT || 6900;
const myrouting = require('./routing/routes');

// app.use(cors());
app.use(express.json());
app.use(myrouting);//Middleware

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
});
// console.log(express);