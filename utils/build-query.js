const buildInsertQuery = (tableName, columns) => {
  const placeholders = columns.map(() => "?").join(", ");
  const columnNames = columns.join(", ");

  return `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
};

const buildUpdateQuery = (tableName, updates, condition) => {
  let query = `UPDATE ${tableName} SET `;
  const setValues = [];
  const conditionValues = [];

  for (const key in updates) {
    if (updates.hasOwnProperty(key)) setValues.push(`${key} = ?`);
  }

  query += setValues.join(", ");

  if (condition) {
    query += " WHERE ";
    for (const key in condition) {
      if (condition.hasOwnProperty(key)) conditionValues.push(`${key} = ?`);
    }
    query += conditionValues.join(" AND ");
  }

  return query;
};

const buildDeleteQuery = (tableName, condition) => {
  let query = `DELETE FROM ${tableName}`;

  if (condition) {
    query += " WHERE ";
    const conditionValues = [];

    for (const key in condition) {
      if (condition.hasOwnProperty(key)) conditionValues.push(`${key} = ?`);
    }
    query += conditionValues.join(" AND ");
  }

  return query;
};

const buildSelectQuery = (tableName, columns = "*", condition, orderBy = "", limit = "") => {
  let query = `SELECT ${columns} FROM ${tableName}`;

  // if (condition) query += ` WHERE ${condition}`;
  if (condition) {
    query += " WHERE ";
    const conditionValues = [];

    for (const key in condition) {
      if (condition.hasOwnProperty(key)) conditionValues.push(`${key} = ?`);
    }
    query += conditionValues.join(" AND ");
  }

  if (orderBy) query += ` ORDER BY ${orderBy}`;

  if (limit) query += ` LIMIT ${limit}`;

  return query;
};

const buildLeaveSelectForCheckOverlapDate = () => {
  return "SELECT * FROM `leave` WHERE person_id = ? AND ((date_start <= ? AND date_end >= ?) OR (date_start <= ? AND date_end >= ?))";
};

const buildLeaveSelectBetweenTwoDate = () => {
  return "SELECT leave.id, type_of_leave as typeOfLeave, person_id as idPerson, date_start as dateStart, date_end as dateEnd,  u.nom , u.email FROM `leave` LEFT JOIN users u ON leave.person_id = u.id WHERE (date_start <= ? AND date_end >= ?) OR (date_start <= ? AND date_end >= ?) OR (date_start BETWEEN  ? AND ?)  OR (date_end BETWEEN  ? AND ?) ORDER BY date_start";
};

const buildLeaveSelectForCheckDisponibility = () => {
  return "SELECT * FROM `leave` WHERE person_id = ? AND ((date_start <= ? AND date_end >= ?))";
};

module.exports = {
  buildInsertQuery,
  buildUpdateQuery,
  buildDeleteQuery,
  buildUpdateQuery,
  buildSelectQuery,
  buildLeaveSelectForCheckOverlapDate,
  buildLeaveSelectForCheckDisponibility,
  buildLeaveSelectBetweenTwoDate,
};
