const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute.js");
const articleRoute = require("./routes/articleRoutes.js");

const durl = "mongodb+srv://Makinde1034:Makinde1034@pencil.2ym6k.mongodb.net/Pencil?retryWrites=true&w=majority"

mongoose.connect(durl).then(()=>{
    console.log("connected to mongoDB");

    app.listen(port,()=>{
        console.log(`listening on ${port}`);
    })
    
}).catch(err=>console.log(err));


const app = express();
app.use(express.json());

const port = 4000 || process.env.port


app.use(authRoute);
app.use(articleRoute);

