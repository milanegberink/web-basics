export const get = (mm, table, id) =>
  mm.db.prepare(`SELECT * from ${table} WHERE id = ?`).get(id);

const operatorMap = {
  max: "<=",
  min: ">=",
};

export function list(mm, table, params, allowedQueryParams) {
  let query = `SELECT * FROM ${table}`;

  const conditions = [];

  if (Object.keys(params).length !== 0) {
    const values = Object.values(params);

    query += " WHERE ";
    for (const key of Object.keys(params)) {
      if (!allowedQueryParams.includes(key)) {
        throw Error("Invalid query parameter");
      }

      const parts = key.split("_");

      if (parts[0] in operatorMap) {
        const operator = operatorMap[parts[0]];
        conditions.push(`${parts[1]} ${operator} ?`);
      } else {
        conditions.push(`${key} LIKE ?`);
      }
    }

    query += conditions.join(" AND ");
    return mm.db.prepare(query).all(...values);
  }
  return mm.db.prepare(`SELECT * FROM ${table}`).all();
}

export function create(mm, table, obj) {
  const values = Object.values(obj);
  const fields = Object.keys(obj);
  const placeholders = Object.keys(obj)
    .map(() => "?")
    .join(", ");
  const fieldList = fields.join(", ");

  const query = `INSERT INTO ${table} (${fieldList}) VALUES (${placeholders})`;

  console.log(query);

  mm.db.prepare(query).run(...values);
}

export const del = (mm, table, id) =>
  mm.db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);

export function update(mm, table, id) {
  const query = `UPDATE ${table} `;
}
