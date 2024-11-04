import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/routes/app.js";

dotenv.config();

const restApiPort = process.env.REST_API_PORT;

const clientOptions = {
  dbName: "fairmeet",
};

mongoose
  .connect(process.env.MONGODB_CONNECTION_URI, clientOptions)
  .then(() => {
    app.listen(restApiPort, () => {
      console.log("Server running on port ", restApiPort);
    });
  })
  .catch(console.dir);
