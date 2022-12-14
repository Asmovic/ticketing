import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHander, NotFoundError, currentUser } from "@asmovictickets/common";

import { indexOrderRouter } from "./routes/index";
import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use(currentUser);

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async ()=>{
    throw new NotFoundError();
})

app.use(errorHander);

export { app }