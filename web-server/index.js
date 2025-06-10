import express from "express";
import { ModelManager } from "./model/index.js";
import { ordersRouter, productsRouter } from "./routes/index.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.locals.state = {
  mm: new ModelManager(),
};

app.use(cors({
  origin: "http://localhost:8080",
}));

app.use("/products", productsRouter);

app.use("/orders", ordersRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
