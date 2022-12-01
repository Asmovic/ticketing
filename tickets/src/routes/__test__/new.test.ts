import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for a post requests", async ()=>{
    const response = await request(app)
        .post("/api/tickets").send({});

        expect(response.status).not.toEqual(404)
})

it("can only be access by authenticated Users", async ()=>{
    const response = await request(app)
    .post("/api/tickets").send({}).expect(401);
})

it("returns status other than 401 if user is signed in", async ()=>{
    const cookie = global.signin();
    const response = await request(app)
    .post("/api/tickets")
    .set('Cookie',cookie)
    .send({});
    
    expect(response.status).not.toEqual(401)
})

it("returns an error if an invalid title is provided", async ()=>{
    await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "",
        price: 30
    })
    .expect(400);

    await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        price: 30
    })
    .expect(400);
})

it("returns an error if an invalid price is provided", async ()=>{
    await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "vana",
        price: -30
    })
    .expect(400);

    await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "vana"
    })
    .expect(400);
})

it("creates a ticket with valid inputs", async ()=>{
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "vana",
        price: 700
    })
    .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(700);
})

it("publishes an event", async ()=>{
    const title = "my title";
    await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title,
        price: 30
    })
    .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})