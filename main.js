const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute.js");
const articleRoute = require("./routes/articleRoutes.js");
require("dotenv").config();
const cors = require("cors");
const durl = "mongodb+srv://Makinde1034:Makinde1034@pencil.2ym6k.mongodb.net/Pencil?retryWrites=true&w=majority"


const app = express();

const corsOptions = {
    origin : "*",
    optionsSuccessStatus : 200
};

app.use(cors(corsOptions));

// app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoute);
app.use(articleRoute);



const port =  process.env.PORT || 4000 

mongoose.connect(durl).then(()=>{
    console.log("connected to mongoDB");

    app.listen(port,()=>{
        console.log(`listening on ${port}`);
    })
    
}).catch(err=>console.log(err));