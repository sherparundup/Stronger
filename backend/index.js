import express from "express";
import dotenv from "dotenv"
import Conn from './src/connections/mongo.connection.js'
import AuthRoutes from "./src/routes/auth.route.js"
import UserRoutes from "./src/routes/user.routes.js"
import ProductRoutes from "./src/routes/product.route.js"
import MembershipRoute from "./src/routes/membership.route.js"
import morgan from "morgan";
import cors from "cors"
import PaymentRoutes from"./src/routes/payment.routes.js"
import UserTestimonial from "./src/routes/userTestimonial.route.js"
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
app.use("/api/Payment",PaymentRoutes)
app.use("/api/UserTestimonial",UserTestimonial)


app.listen(Port,()=>{console.log(`running on port ${Port}`)})

