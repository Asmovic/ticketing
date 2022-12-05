import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@asmovictickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save ticket
    const ticket = Ticket.build({
        title: "FIFA",
        price: 30,
        userId: "fnfdhg"
    });
    await ticket.save();

    // Create the fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "fgdgrddhg",
        expiresAt: "fnfdhg",
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    //return all
    return { listener, ticket, data, msg }
}

it("sets the orderId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toEqual(data.id)
})

it("ack the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it("publishes a ticket updated event", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedTicketData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(updatedTicketData!.orderId).toEqual(data.id)

})