import express from "express";
import events from "@routes/events";
import spots from "@routes/spots.routes";
import { errorHandler } from "@middlewares/errors";

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

// Centralized error-handling middleware
app.use(errorHandler);

export default app;
