import express, { json } from "express";
import cors from "cors";
import router from "./src/routers/router.js";
import "./src/config/setup.js";
import handleErrorsMiddleware from "./src/middlewares/errorHandleMiddleware.js";

const app = express();
app.use(cors());
app.use(json());
app.use(router);
app.use(handleErrorsMiddleware);


const PORT = +process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`)
})