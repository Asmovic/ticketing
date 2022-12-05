import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@asmovictickets/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // Create and save ticket
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: "FIFA",
        price: 30,
        userId: "fnfdhg"
    });
    ticket.set({ orderId });
    await ticket.save();

    // Create the fake data event
    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    //return all
    return { listener, ticket, data, msg }
}

it("updates the ticket, publishes an event, and acks the message", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})