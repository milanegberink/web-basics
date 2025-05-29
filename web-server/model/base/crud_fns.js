export const get = (mm, table, id) =>
  mm.db.prepare(`SELECT * from ${table} WHERE id = ?`).get(id);

export const list = (mm, table) =>
  mm.db.prepare(`SELECT * FROM ${table}`).all();

export const create = (mm, table, obj) => {
  const fields = Object.keys(obj);
  const values = Object.values(obj);

  const placeholders = values.map(() => "?").join(", ");
  const fieldList = fields.join(", ");

  const query = `INSERT INTO ${table} (${fieldList}) VALUES (${placeholders})`;

  mm.db.prepare(query).run(...values);
};

export const del = (mm, table, id) =>
  mm.db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
