import { get, create, list, del } from "./base/index.js";
import { tryCatch } from "../utils/try-catch.js";

/*
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT,
    product_code INTEGER UNIQUE NOT NULL,
    description TEXT,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
);
*/

export class Product {
  id;
  name;
  price;
  image;
  product_code;
  description;
  stock_quantity;

  constructor({
    id,
    name,
    price,
    image,
    product_code,
    description,
    stock_quantity,
  }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.product_code = product_code;
    this.description = description;
    this.stock_quantity = stock_quantity;
  }
}

export class ProductForCreate {
  name;
  price;
  image;
  product_code;
  description;
  stock_quantity;
  constructor({
    name,
    price,
    image,
    product_code,
    description,
    stock_quantity,
  }) {
    this.name = name;
    this.price = price;
    this.image = image;
    this.product_code = product_code;
    this.description = description;
    this.stock_quantity = stock_quantity;
  }
}

// class ProductForOrderIns extends ProductForCreate {
//   quantity;
//   constructor(super) {

//   }
// }

export class ProductBmc {
  static table = "products";
  static allowedQueryParams = [
    "id",
    "name",
    "price",
    "stock_quantity",
    "product_code",
  ];

  static get(mm, id) {
    const data = get(mm, this.table, id);
    return new Product(data);
  }

  static list(mm, params) {
    const [data, error] = tryCatch(() =>
      list(mm, this.table, params, this.allowedQueryParams),
    );

    if (error) throw error;

    const products = data.map((obj) => new Product(obj));
    return products;
  }

  static create(mm, product) {
    if (!(product instanceof ProductForCreate)) {
      return;
    }
    create(mm, this.table, product);
  }

  static delete(mm, id) {
    del(mm, this.table, id);
  }
}
