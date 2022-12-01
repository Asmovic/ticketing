import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@asmovictickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";

const router = express.Router();

router.post("/api/routes", requireAuth, [
    body("tickedId")
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided"),
    body("price")
    .isFloat({ gt: 0 })
    .notEmpty()
    .withMessage("Price must be greater than zero")
], validateRequest, async (req:Request, res:Response)=>{
    const { title, price } = req.body;
    const ticket = Ticket.build({
        title, price, userId: req.currentUser!.id
    })
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.status(201).send(ticket)
})

export { router as createTicketRouter }