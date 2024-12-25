import express from "express";
import { getAllUser } from "../controller/UserController.js";

const Router=express.Router();

Router.get("/AllUser",getAllUser)


export default Router;