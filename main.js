const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute.js");
const articleRoute = require("./routes/articleRoutes.js");
const cors = require("cors");

const app = express();



app.use(cors())
app.options('*', cors())


const durl = "mongodb+srv://Makinde1034:Makinde1034@pencil.2ym6k.mongodb.net/Pencil?retryWrites=true&w=majority"






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