import { get, create, list, del } from "./base/index.js";

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
  static get(mm, id) {
    const data = get(mm, this.table, id);
    return new Product(data);
  }

  static list(mm) {
    const data = list(mm, this.table);
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
