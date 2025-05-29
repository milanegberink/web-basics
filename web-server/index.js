import express from "express";
import { ModelManager } from "./model/index.js";
import { productsRouter } from "./routes/index.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.locals.state = {
  mm: new ModelManager(),
};

app.use("/products", productsRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
