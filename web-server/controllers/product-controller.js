import { ProductBmc, ProductForCreate } from "../model/index.js";
import { tryCatch } from "../utils/try-catch.js";

export function create(req, res) {
  const { name, price } = req.body;
  const product = new ProductForCreate(name, price);
  ProductBmc.create(req.app.locals.state.mm, product);

  res.status(201).send();
}

export function del(req, res) {
  const { id } = req.params;
  ProductBmc.delete(req.app.locals.state.mm, id);

  res.status(200).send;
}

export async function getById(req, res) {
  const { id } = req.params;
  const [product, error] = await tryCatch(() =>
    ProductBmc.get(req.app.locals.state.mm, id),
  );

  if (error) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product).status(200);
}

export function listAll(req, res) {
  const products = ProductBmc.list(req.app.locals.state.mm);
  res.json(products).status(200);
}
