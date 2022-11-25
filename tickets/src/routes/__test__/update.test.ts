import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exist", async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
        title: "vana",
        price: 700
    })
    .expect(404);
})

it("returns a 401 if the user is not authenticated", async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title: "vana",
        price: 700
    })
    .expect(401);
})

it("returns a 401 if the user does not own the ticket", async ()=>{
   const response = await request(app)
    .post("/api/tickets")
    .set('Cookie', global.signin())
    .send({
        title: "vasdena",
        price: 200
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
        title: "mustang",
        price: 800
    })
    .expect(401);
})

it("returns a 400 if the user provides an invalid title or price", async ()=>{
    const cookie = global.signin();

    const response = await request(app)
    .post("/api/tickets")
    .set('Cookie', cookie)
    .send({
        title: "ferari",
        price: 900
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: "",
        price: 100
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: "porshe",
        price: -300
    })
    .expect(400);
})

it("updates the ticket if inputs are valid", async ()=>{
    const cookie = global.signin();

    const response = await request(app)
    .post("/api/tickets")
    .set('Cookie', cookie)
    .send({
        title: "ferari",
        price: 900
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: "Fendi",
        price: 100
    })
    .expect(200);

    const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`)
            .send();

            expect(ticketResponse.body.title).toEqual("Fendi")
            expect(ticketResponse.body.price).toEqual(100)
})