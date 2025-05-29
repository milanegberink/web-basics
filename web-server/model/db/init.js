import fs from "fs";
import Database from "better-sqlite3";

const sql = fs.readFileSync("model/db/schema/init.sql", "utf8");

const db = new Database("model/db/db.sqlite");

db.exec(sql);
