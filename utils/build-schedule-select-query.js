const  buildScheduleQuery =  (condition) =>{
    let query = `
        SELECT s.id, s.date, s.shift, s.person_id as idPerson, s.types_id AS idType, u.nom , u.email,
         t.nom_type AS typeLabel, t.nom_sous_type AS subTypeLabel  FROM schedule s
        INNER JOIN users u ON s.person_id = u.id
        INNER JOIN types t ON s.types_id = t.id`;
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

module.exports = {
    buildScheduleQuery
};