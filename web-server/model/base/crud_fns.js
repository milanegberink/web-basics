export const get = (mm, table, id) =>
  mm.db.prepare(`SELECT * from ${table} WHERE id = ?`).get(id);

const operatorMap = {
  max: "<=",
  min: ">=",
};

export function list(mm, table, params, allowedQueryParams) {
  let query = `SELECT * FROM ${table}`;

  const paramEntries = Object.entries(params);

  if (paramEntries.length === 0) {
    return mm.db.prepare(query).all();
  }

  const conditions = [];
  const queryValues = [];

  for (const [key, value] of paramEntries) {
    const parts = key.split("_");
    let columnName;
    let sqlOperator;

    if (parts.length > 1 && operatorMap.hasOwnProperty(parts[0])) {
      sqlOperator = operatorMap[parts[0]];
      columnName = parts.slice(1).join("_");
    } else {
      columnName = key;
      sqlOperator = "LIKE";
    }

    if (!allowedQueryParams.includes(columnName)) {
      throw new Error(
        `Invalid or disallowed query parameter: Column '${columnName}' (derived from parameter '${key}') is not allowed.`,
      );
    }

    conditions.push(`${columnName} ${sqlOperator} ?`);
    queryValues.push(value);
  }

  query += ` WHERE ${conditions.join(" AND ")}`;
  return mm.db.prepare(query).all(...queryValues);
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
