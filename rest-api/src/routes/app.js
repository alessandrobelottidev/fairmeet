import express from "express";

const app = express();

app.get("/healthcheck", (_, res) => {
  res.send({
    Status: "Running healthy",
    Connections: app.locals,
  });
});

export default app;
