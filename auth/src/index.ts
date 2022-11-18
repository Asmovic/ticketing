import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHander } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";


const app = express();

app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", async ()=>{
    throw new NotFoundError();
})

app.use(errorHander);

app.listen(3000, ()=>{
    console.log("Listening on Port 3000!!!!");
})