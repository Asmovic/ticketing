import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";


it("returns a 404 if the ticket is not found", async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString(); 
    const resp = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
})

it("returns the ticket if the ticket is found", async ()=>{
    const resp = await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "vana",
        price: 700
    })
    .expect(201);

    const foundTicket = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
    expect(200);

    expect(foundTicket.body.title).toEqual("vana")
    expect(foundTicket.body.price).toEqual(700)
})