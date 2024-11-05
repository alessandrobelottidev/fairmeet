import express from "express";
import events from "./events";

const app = express();

app.get("/healthcheck", (_, res) => {
  res.send({
    Status: "Running healthy",
    DateTime: Date.now(),
    AppLocals: app.locals,
  });
});

app.use("/events", events);

export default app;
