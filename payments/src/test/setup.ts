import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
    function signin(id?:string): string[];
  }

jest.mock("../nats-wrapper.ts")
  
/*   declare global {
    namespace NodeJS {
        interface Global {
            signin(): string []
        }
    }
  } */

  process.env.STRIPE_KEY = "sk_test_51MCjBIKcWQZf5OubupjfQNQL6cl5KOpXzQl33LZ0r4MfwJaRHOX4Kf103otcW7rHu3UlskMy4zrrdsqL2sphYXv400s7qMoVD7";

let mongo:any;
beforeAll(async () => {
    process.env.JWT_KEY = "asdfhgf";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async ()=>{
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async ()=>{
    await mongo.stop;
    await mongoose.connection.close();
})

global.signin = (id?:string) => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "test@gmail.com"
    }
    // Create the JWT
        const token = jwt.sign(payload, process.env.JWT_KEY!)

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token }

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session)

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");
    console.log(base64)
    // return a string thats the cookie with the  encoded data
    return [`session=${base64}`];
}