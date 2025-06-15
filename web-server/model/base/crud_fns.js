export const get = (mm, table, id) =>
  mm.db.prepare(`SELECT * from ${table} WHERE id = ?`).get(id);

const operatorMap = {
  max: "<=",
  min: ">=",
  like: "LIKE",
};

export function list(mm, table, params, allowedQueryParams) {
  let query = `SELECT * FROM ${table}`;

  const entries = Object.entries(params);

  if (entries.length === 0) {
    return mm.db.prepare(query).all();
  }

  const conditions = [];
  const queryValues = [];

  for (const [key, value] of entries) {
    if (value === undefined || value === null || String(value).trim() === "") {
      continue;
    }

    const parts = key.split("_");
    let column;
    let sqlOperator;

    if (
      parts.length > 1 &&
      typeof operatorMap === "object" &&
      operatorMap !== null &&
      operatorMap.hasOwnProperty(parts[0].toLowerCase())
    ) {
      sqlOperator = operatorMap[parts[0].toLowerCase()];
      column = parts.slice(1).join("_");
    } else {
      column = key;
    }

    if (!allowedQueryParams.includes(column)) {
      throw new Error(
        `Invalid query parameter: Column '${column}' (from parameter '${key}') is not allowed.`,
      );
    }

    if (
      (sqlOperator === "IN" || sqlOperator === "NOT IN") &&
      typeof value === "string"
    ) {
      const inValues = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
      if (inValues.length > 0) {
        conditions.push(
          `${column} ${sqlOperator} (${inValues.map(() => "?").join(",")})`,
        );
        queryValues.push(...inValues);
      } else {
        if (sqlOperator === "IN") {
          conditions.push("1=0");
        } else {
          conditions.push("1=1");
        }
      }
    } else if (
      !sqlOperator &&
      typeof value === "string" &&
      value.includes(",")
    ) {
      const inValues = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
      if (inValues.length > 0) {
        conditions.push(`${column} IN (${inValues.map(() => "?").join(",")})`);
        queryValues.push(...inValues);
      } else {
        conditions.push("1=0");
      }
    } else {
      if (!sqlOperator) {
        sqlOperator = "=";
      }
      conditions.push(`${column} ${sqlOperator} ?`);
      queryValues.push(value);
    }
  }

  if (conditions.length === 0) {
    return mm.db.prepare(query).all();
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

  const result = mm.db.prepare(query).run(...values);
  return result.lastInsertRowid;
}

export const del = (mm, table, id) =>
  mm.db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);

export function update(mm, table, id, fields, allowedFields) {
  const validKeys = Object.keys(fields).filter((key) =>
    allowedFields.includes(key),
  );

  if (validKeys.length === 0) {
    return Promise.reject(new Error("No valid fields provided for update."));
  }

  const setClause = validKeys.map((key) => `\`${key}\` = ?`).join(", ");

  const values = validKeys.map((key) => fields[key]);

  values.push(id);

  const query = `UPDATE \`${table}\` SET ${setClause} WHERE id = ?`;

  mm.db.prepare(query).run(values);
}

export function withTransaction(mm, cb) {
  const txn = mm.db.transaction(cb);
  return txn();
}
