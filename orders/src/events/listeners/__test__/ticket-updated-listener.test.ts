import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@asmovictickets/common";

const setup = async () => {
    // Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "FIFA",
        price: 200
    })
    await ticket.save();
    // Create a fake data object
    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        title: "UEFA",
        version: ticket.version + 1,
        price: 300,
        userId: "gbdfbdf"
    }
    // Create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    // return all
    return { listener, ticket, data, msg}
}

it("finds, update, and saves a ticket", async () => {
    const {listener, ticket, data, msg} = await setup();
    
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data,msg);

    // Write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it("acks the message", async () => {
    const { listener, data, msg } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled()
})

it("does not call ack if the event has a skipped version number", async () => {
    const { listener, data, msg } = await setup();
    data.version = 3;
    // Call the onMessage function with the data object + message object
    try {
        await listener.onMessage(data, msg);
    } catch(err) {

    }
    // Write assertions to make sure ack function is called
    expect(msg.ack).not.toHaveBeenCalled()
})