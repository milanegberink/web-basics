import { get, create, list, del } from "./base/index.js";
import { tryCatch } from "../utils/try-catch.js";

class Product {
  id;
  name;
  price;

  constructor({ id, name, price }) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

export class ProductForCreate {
  name;
  price;
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
}

export class ProductBmc {
  static table = "products";
  static allowedQueryParams = ["id", "name", "price"];

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
