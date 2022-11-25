import express, { Request, Response } from "express";
import { requireAuth, NotFoundError, NotAuthorizedError, validateRequest } from "@asmovictickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put("/api/tickets/:id", requireAuth, [
    body("title")
    .notEmpty()
    .withMessage("Title must be provided"),
    body("price")
    .isFloat({ gt: 0 })
    .notEmpty()
    .withMessage("Price must be greater than zero")
], validateRequest, async (req:Request, res:Response)=>{
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket) {
        throw new NotFoundError();
    }
    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });

    await ticket.save();
    
    res.status(200).send(ticket)
})

export { router as updateTicketRouter }