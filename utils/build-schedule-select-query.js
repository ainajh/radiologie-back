const  buildScheduleQuery =  (filterType, filterValue) =>{
    let query = `
        SELECT s.id, s.date, s.shift, s.person_id as idPerson, s.types_id AS idType, u.nom , u.email,
         t.nom_type AS typeLabel, t.nom_sous_type AS subTypeLabel  FROM schedule s
        INNER JOIN users u ON s.person_id = u.id
        INNER JOIN types t ON s.types_id = t.id`;

    if (filterType && filterValue) query += ` WHERE ${filterType} = '${filterValue}'`;

    return query;
}

module.exports = {
    buildScheduleQuery
};