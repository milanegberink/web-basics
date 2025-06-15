import { tryCatch } from "../utils/index.js";
import { withTransaction } from "./base/index.js";
import { ProductBmc } from "./product.js";
import { get, create, list, del } from "./base/index.js";
import { Product } from "./product.js";

/*
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    shipping_address TEXT,
    order_status VARCHAR(20) DEFAULT 'pending',
    total_amount INTEGER NOT NULL,
);
*/

class Order {
  id;
  customer_name;
  customer_email;
  customer_phone;
  shipping_address;
  order_status;
  total_amount;
  products;

  constructor({
    id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    order_status,
    total_amount,
    products,
  }) {
    this.id = id;
    this.customer_name = customer_name;
    this.customer_email = customer_email;
    this.customer_phone = customer_phone;
    this.shipping_address = shipping_address;
    this.order_status = order_status;
    this.total_amount = total_amount;
    this.products = products;
  }
}

export class OrderForCreate {
  customer_name;
  customer_email;
  customer_phone;
  shipping_address;
  order_status;
  total_amount;

  constructor({
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    order_status,
    total_amount,
  }) {
    this.customer_name = customer_name;
    this.customer_email = customer_email;
    this.customer_phone = customer_phone;
    this.shipping_address = shipping_address;
    this.order_status = order_status;
    this.total_amount = total_amount;
  }
}

class OrderItem {
  order_id;
  product_id;
  quantity;
  unit_price;
  total_price;

  constructor(order_id, product_id, quantity, unit_price, total_price) {
    this.order_id = order_id;
    this.product_id = product_id;
    this.quantity = quantity;
    this.unit_price = unit_price;
    this.total_price = total_price;
  }
}

export class OrderBmc {
  static table = "orders";
  static allowedQueryParams = ["id", "name", "price"];

  static get(mm, id) {
    const order = withTransaction(mm, () => {
      const order = get(mm, this.table, id);
      const orderItems = list(mm, "order_items", { order_id: order.id }, [
        "order_id",
      ]);

      const productIds = orderItems.map((item) => item.product_id).join(",");

      const products = ProductBmc.list(mm, { id: productIds });

      return new Order({ ...order, products });
    });
    return order;
  }

  static list(mm, params) {
    const [data, error] = tryCatch(() =>
      list(mm, this.table, params, this.allowedQueryParams),
    );

    if (error) throw error;

    const orders = data.map((obj) => new Order(obj));
    return orders;
  }

  static create(mm, order, products) {
    if (!(order instanceof OrderForCreate)) {
      throw Error("Order is not of the right format");
    }

    withTransaction(mm, () => {
      const order_id = create(mm, this.table, order);

      for (const product of products) {
        const item = new OrderItem(
          order_id,
          product.id,
          product.quantity,
          product.price,
          product.quantity * product.price,
        );
        create(mm, "order_items", item);
      }

      return order_id;
    });
  }

  static delete(mm, id) {
    del(mm, this.table, id);
  }
}
