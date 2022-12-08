import { BadRequestError, currentUser, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@asmovictickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.post("/api/payments", requireAuth, [
    body("token").notEmpty(),
    body("orderId").notEmpty(),
], validateRequest, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if(!order) {
        throw new NotFoundError();
    }

    if(req.currentUser!.id !== order.userId) {
        return new NotAuthorizedError();
    }
    if(order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Cannot pay for a cancelled order")
    }
});

export { router as createChargeRouter }