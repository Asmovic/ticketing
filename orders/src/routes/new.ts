import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@asmovictickets/common";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.post("/api/orders", requireAuth, [
    body("tickedId")
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided")
], validateRequest, async (req:Request, res:Response)=>{
    
    res.status(201).send({})
})

export { router as createOrderRouter }