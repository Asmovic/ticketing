import request from "supertest";
import { app } from "../../app";

it("returns a 201 status code on successful signup", async () =>{
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "movic@gmail.com",
            password: 'secret'
        })
        .expect(201)
})

it("returns a 400 status code with invalid email", async () =>{
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "movicgmail",
            password: 'secret'
        })
        .expect(400)
})

it("returns a 400 status code with invalid password", async () =>{
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "movic@gmail.com",
            password: 'sec'
        })
        .expect(400)
})

it("returns a 400 status code with missing email and password", async () =>{
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "movic@gmail.com"
        })
        .expect(400)

        await request(app)
        .post("/api/users/signup")
        .send({
            password: "secret"
        })
        .expect(400)
})

it("disallows duplicate emails", async () =>{
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "movic@gmail.com",
            password: 'secret'
        }).expect(201)

        await request(app)
        .post("/api/users/signup")
        .send({
            email: "movic@gmail.com",
            password: 'secret'
        })
        .expect(400)
})

it("sets a cookie after successful signup", async () =>{
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "movic@gmail.com",
            password: 'secret'
        })
        .expect(201)

        expect(response.get("Set-Cookie")).toBeDefined();
})