const buildScheduleQuery = (condition) => {
  let query = `
        SELECT s.id, s.date,s.message, s.shift, s.person_id as idPerson, s.types_id AS idType, s.type_of_schedule AS typeOfSchedule, u.nom , u.email,
         t.nom_type AS typeLabel, t.nom_sous_type AS subTypeLabel  FROM schedule s
        LEFT JOIN users u ON s.person_id = u.id
        LEFT JOIN types t ON s.types_id = t.id`;
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

const selectDataBetweenDatesQuery = `
        SELECT s.id, s.date, s.message, s.shift, s.person_id as idPerson, s.types_id AS idType, s.type_of_schedule AS typeOfSchedule
        FROM schedule s
        WHERE s.date BETWEEN ? AND ?;
      `;

module.exports = {
  buildScheduleQuery,
  selectDataBetweenDatesQuery,
};
