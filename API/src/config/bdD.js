import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB Atlas");
  })
  .catch((error) => {
    console.log(`Ocurrió el siguiente error al conectarse == ${error.message}`);
  });

  export default port;