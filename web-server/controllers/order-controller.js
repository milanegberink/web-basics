import { OrderBmc, OrderForCreate } from "../model/order.js";
import { ProductBmc } from "../model/product.js";
import { tryCatch } from "../utils/try-catch.js";

export function create(req, res) {
  const mm = req.app.locals.state.mm;
  const order = new OrderForCreate(req.body);

  const productIds = req.body.products.map((item) => item.id).join(",");

  let products = ProductBmc.list(mm, { id: productIds });

  products = products.map((product) => {
    const match = req.body.products.find((p) => p.id === product.id);
    return {
      ...product,
      quantity: match?.quantity ?? 1,
    };
  });
  OrderBmc.create(mm, order, products);

  res.status(201).send();
}

export function del(req, res) {
  const { id } = req.params;
  OrderBmc.delete(req.app.locals.state.mm, id);

  res.status(200).send;
}

export function getById(req, res) {
  const { id } = req.params;
  const [order, error] = tryCatch(() =>
    OrderBmc.get(req.app.locals.state.mm, id),
  );

  if (error) {
    console.error(error);
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order).status(200);
}

export function listAll(req, res) {
  const [orders, error] = tryCatch(() =>
    OrderBmc.list(req.app.locals.state.mm, req.query),
  );

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(orders).status(200);
}
