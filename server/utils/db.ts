import mongoose from "mongoose";
require("dotenv").config();
const dbUrl: string = process.env.DB_URL || '';
const connect_Db = async ()=>{
    try{
        await mongoose.connect(dbUrl).then((data:any)=>{
            console.log(`Database connected with ${data.coonting.host}`)
        })
    }catch(error:any){
        console.log(error.message);
        setTimeout(connect_Db,5000);
    }
}
export default connect_Db;