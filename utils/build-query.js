

const  buildInsertQuery =  (tableName, columns) => {

    const placeholders = columns.map(() => '?').join(', ');
    const columnNames = columns.join(', ');

    return `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
}

const  buildUpdateQuery =  (tableName, updates, condition) => {

    let query = `UPDATE ${tableName} SET `;
    const setValues = [];
    const conditionValues = [];

    for (const key in updates) {
        if (updates.hasOwnProperty(key))  setValues.push(`${key} = ?`); 
    }

    query += setValues.join(', ');

    if (condition) {
        query += ' WHERE ';
        for (const key in condition) {
            if (condition.hasOwnProperty(key)) conditionValues.push(`${key} = ?`); 
        }
        query += conditionValues.join(' AND ');
    }

    return query;
}



const  buildDeleteQuery =  (tableName, condition) => {

    let query = `DELETE FROM ${tableName}`;

    if (condition) {

        query += ' WHERE ';
        const conditionValues = [];

        for (const key in condition) {
            if (condition.hasOwnProperty(key)) conditionValues.push(`${key} = ?`);  
        }
        query += conditionValues.join(' AND ');
    }

    return query;
}


const  buildSelectQuery = (tableName, columns = '*', condition = '', orderBy = '', limit = '') => {

    let query = `SELECT ${columns} FROM ${tableName}`;

    if (condition) query += ` WHERE ${condition}`;

    if (orderBy) query += ` ORDER BY ${orderBy}`;

    if (limit)  query += ` LIMIT ${limit}`;

    return query;
}

module.exports = {
    buildInsertQuery, 
    buildUpdateQuery,
    buildDeleteQuery, 
    buildUpdateQuery, 
    buildSelectQuery
  };