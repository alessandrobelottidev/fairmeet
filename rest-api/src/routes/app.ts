import express from "express";
import events from "./events";
import spots from "./spots";

const app = express();

app.use(express.json());

app.get("/healthcheck", (_, res) => {
  res.send({
    Status: "Running healthy",
    DateTime: Date.now(),
    AppLocals: app.locals,
  });
});

app.use("/v1/events", events);
app.use("/v1/spots", spots);

export default app;
