import express from "express";
import { ModelManager } from "./model/index.js";
import { ordersRouter, productsRouter } from "./routes/index.js";

const app = express();

app.use(express.json());

app.locals.state = {
  mm: new ModelManager(),
};

app.use("/products", productsRouter);

app.use("/orders", ordersRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
