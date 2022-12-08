import { BadRequestError, currentUser, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@asmovictickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";

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


    // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
    const charge = await stripe.charges.create({
    amount: order.price * 100,
    currency: 'usd',
    source: token
    });

    res.status(201).send({ success: true });
});

export { router as createChargeRouter }