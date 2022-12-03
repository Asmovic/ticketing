import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async ()=>{
    const ticketId = new mongoose.Types.ObjectId().toHexString(); 
    const cookie = global.signin();
    const response = await request(app)
    .post("/api/orders")
    .set('Cookie',cookie)
    .send({ ticketId })
    .expect(404)
})

it("returns an error if the ticket is already reserved", async ()=>{
    const cookie = global.signin();
    const ticket = Ticket.build({
        id: "custom id",
        title: "WC Final",
        price: 30
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: "random id..",
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();
    await request(app)
    .post("/api/orders")
    .set('Cookie',cookie)
    .send({ ticketId: ticket.id })
    .expect(400)
})

it("reserves a ticket", async ()=>{
    const cookie = global.signin();
    const ticket = Ticket.build({
        id: "custom id",
        title: "WC Final",
        price: 30
    });
    await ticket.save();

    await request(app)
    .post("/api/orders")
    .set('Cookie',cookie)
    .send({ ticketId: ticket.id })
    .expect(201)
})

it("emits an order created event", async ()=>{
    const ticket = Ticket.build({
        id: "custom id",
        title: "WC Final",
        price: 30
    });
    await ticket.save();

    await request(app)
    .post("/api/orders")
    .set('Cookie',global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
