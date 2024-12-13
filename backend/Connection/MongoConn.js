import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connUrl=process.env.MONGO_CONN;

const MongoCon=async()=>{
   try {
    const conn=await mongoose.connect(connUrl);
    if(conn){
        console.log("connected to mogodb");
    }
    
} catch (error) {
       console.log(`error in mongoconn ${error}`);
    
   }

}
export default MongoCon;