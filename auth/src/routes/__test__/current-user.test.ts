import request from "supertest";
import { app } from "../../app";
import { signupRouter } from "../signup";

it("responds with details about the current user", async () =>{
        const cookie = await global.signin();

        console.log("current-cookie", cookie)

        const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);

        expect(response.body.currentUser.email).toEqual("movic@gmail.com");
})

it("responds with null if not authenticated", async () =>{
    const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

    expect(response.body.currentUser).toEqual(null);
})