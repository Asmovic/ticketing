import { requireAuth, validateRequest } from "@asmovictickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";

const router = express.Router();

router.post("/api/payments", requireAuth, [
    body("token").notEmpty(),
    body("orderId").notEmpty(),
], validateRequest, async (req: Request, res: Response) => {
    


    res.send({ success: true })
});

export { router as createChargeRouter }