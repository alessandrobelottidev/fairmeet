import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./routes/app";

dotenv.config();

const connectionUri: string = process.env.MONGODB_CONNECTION_URI ?? "";
const restApiPort = process.env.REST_API_PORT ?? 3000;

const clientOptions = {
  dbName: "fairmeet",
};

mongoose
  .connect(connectionUri, clientOptions)
  .then(() => {
    app.listen(restApiPort, () => {
      console.log("Server running on port ", restApiPort);
    });
  })
  .catch(console.dir);
