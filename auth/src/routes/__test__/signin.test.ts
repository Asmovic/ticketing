import request from "supertest";
import { app } from "../../app";

it("fails when email that does not exist is supplied", async () =>{
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "movic@gmail.com",
            password: 'secret'
        })
        .expect(400)
})

it("fails when incorrect password is supplied", async () =>{
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "movic@gmail.com",
            password: 'secret'
        })
        .expect(201)

        await request(app)
        .post("/api/users/signin")
        .send({
            email: "movic@gmail.com",
            password: 'secre'
        })
        .expect(400)
})

it("responds with cookie when given valid credentials", async () =>{
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "movic@gmail.com",
            password: 'secret'
        })
        .expect(201)

        const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "movic@gmail.com",
            password: 'secret'
        })
        .expect(200)

        expect(response.get("Set-Cookie")).toBeDefined();
})