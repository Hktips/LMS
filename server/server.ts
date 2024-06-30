import {app} from "./app";
import {v2 as cloudinary} from "cloudinary"
import connect_Db from "./utils/db";
require("dotenv").config();

//cloudnary config
cloudinary.config({
   cloud_name: process.env.CLOUDE_NAME, 
   api_key: process.env.CLOUD_API_KEY,
   api_secret: process.env.CLOUD_SECRET_KEY,
})

app.listen(process.env.PORT,()=>{
    console.log(`server is connected with ${process.env.PORT}`);
    connect_Db();
})