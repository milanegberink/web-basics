import Database from "better-sqlite3";
export { ProductBmc, ProductForCreate } from "./product.js";

export class ModelManager {
  db;
  constructor() {
    this.db = new Database("model/db/db.sqlite");
  }
}
