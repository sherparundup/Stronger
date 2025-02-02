import express from "express";
import dotenv from "dotenv"
import Conn from './Connection/MongoConn.js'
import AuthRoutes from "./Routes/AuthRoutes.js"
import UserRoutes from "./Routes/UserRoutes.js"
import ProductRoutes from "./Routes/ProductRoutes.js"
import MembershipRoute from "./Routes/MembershipRoutes.js"
import morgan from "morgan";
import cors from "cors"
import ExpressFormidable from "express-formidable";
dotenv.config();

Conn();//mongo ko conn


const app=express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors())
const Port = process.env.PORT || 3000;
app.get("/",(req,res)=>{
    res.send("hwheheha")
});
app.use("/api/auth",AuthRoutes);
app.use("/api/User",UserRoutes)
app.use("/api/membership",MembershipRoute)
app.use("/api/Product",ProductRoutes)


app.listen(Port,()=>{console.log(`running on port ${Port}`)})

