import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@asmovictickets/common";
import { body } from "express-validator";

const router = express.Router();

router.post("/api/tickets", requireAuth, [
    body("title")
    .notEmpty()
    .withMessage("Title must be provided"),
    body("price")
    .isFloat({ gt: 0 })
    .notEmpty()
    .withMessage("Price must be greater than zero")
], validateRequest, (req:Request, res:Response)=>{
    res.status(200).send({})
})

export { router as createTicketRouter }