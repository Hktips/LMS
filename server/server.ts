import {app} from "./app";
import connect_Db from "./utils/db";
require("dotenv").config();


app.listen(process.env.PORT,()=>{
    console.log(`server is connected with ${process.env.PORT}`);
    connect_Db();
})