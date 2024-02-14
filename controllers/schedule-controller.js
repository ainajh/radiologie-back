const db = require("../db");
const dbPromise = require("../db-for-promise");
const Validaion = require("../utils/validations");
const Query  = require("../utils/build-query");
const QuerySchedule  = require("../utils/build-schedule-select-query");


const create = async (req, res) => {  
  try {

    const { idPerson, shift, date, idType  } = req.body;

    if ( Validaion.isEmptyOrNull(idPerson) || !Validaion.isTimeOfDay(shift) || !Validaion.isDate(date) || Validaion.isEmptyOrNull(idType)) {
      return res.status(422).json({ error: "Champ invalide!",});
    }

    const [rows, fields] =  await dbPromise.query(Query.buildSelectQuery( "schedule", "*", {"schedule.date": null,"schedule.person_id":null," schedule.shift":null} ),[new Date(date).toISOString(),idPerson, shift]); 

    if(rows.length > 0){
      return res.status(422).json({ message: "Impossible de creer un schedule pour une meme person sur meme date and dataTime"});
    }

    const columns = ['date', 'shift', 'types_id', 'person_id'];

    const query =  Query.buildInsertQuery("schedule", columns)

    db.query( query, [new Date(date), shift, idType, idPerson],
      (err, result) => {

        if (err)  return res.status(500).json({ message: "Erreur lors de la création du schedule",error: err});
        
        return res.status(201).send({
          message: "Schedule créé avec succès", 
          data: result 
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Erreur lors de la création du type",error: err});
  }
};

const updateOne = async (req, res) => {
  try {
    const { id } = req.params
    const { date, shift, idType, idPerson } = req.body;

    if (Validaion.isEmptyOrNull(id))  return res.status(422).json({error: "Params invalide!",});

    let updates =  {}
    let select =  {}
    let selectedValues = []
    let values =  []
    console.log(req.body)
    
    if(Validaion.isDate(date)) {
        updates =  {...updates, "date" : new Date(date)  }
        select =  {...select, "schedule.date" : new Date(date).toISOString() }
        selectedValues = [...selectedValues , new Date(date).toISOString()]
        values = [...values , new Date(date)]
    }
    
    if(Validaion.isTimeOfDay(shift)){ 
      updates =  {...updates, "shift" : shift }
      select =  {...select, "schedule.shift" : shift }
      selectedValues = [...selectedValues , shift]
      values = [...values , updates.shift]
    } 
   
    if(!Validaion.isEmptyOrNull(idPerson)) {
        updates =  {...updates, "person_id" : idPerson }
        select =  {...select, "schedule.person_id" : idPerson }
        selectedValues = [...selectedValues , idPerson]
        values = [...values , updates.person_id]

    }

    if(!Validaion.isEmptyOrNull(idType)) {
      updates =  {...updates, "types_id" : idType }
      select =  {...select, "schedule.types_id" : idType }
      selectedValues = [...selectedValues , idType]
      values = [...values , updates.types_id]
     }

    const [rows, fields] =  await dbPromise.query(Query.buildSelectQuery( "schedule", "*", select), values); 
    
    if( rows.length > 0){
      return res.status(422).json({ message: "Impossible de mettre a jour le schedule"});
    }
    
    const [rowsSecond, fieldsSecond ] =  await dbPromise.query(Query.buildSelectQuery( "schedule", "*", {"schedule.id": id}), [id]); 
    
    if( rowsSecond.length === 0){
      return res.status(422).json({ message: "Impossible de mettre a jour le schedule"});
    }

    if (new Date(rowsSecond[0].date).toLocaleDateString() !=  updates.date.toLocaleDateString() || rowsSecond[0].shift != updates.shift){
      delete select["schedule.types_id"]
      selectedValues.pop()
      const [rowsFird, fieldsFird] =  await dbPromise.query(Query.buildSelectQuery( "schedule", "*", select),selectedValues ); 
      if( rowsFird.length > 0){
        return res.status(422).json({ message: "Impossible de mettre a jour le schedule"});
      }
    }

    const query =  Query.buildUpdateQuery("schedule", updates, {"id":id})
    values = [...values , id]


    db.query(query, values, (err, result) => {

        if (err) return res.status(500).json({message: "Erreur lors de la modification!", error: err});
        return res.status(200).send({
          message: "Modification efféctuée",
          data: result
        });

      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Erreur lors de la modification du schedule", error: err});
  }
};

const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (Validaion.isEmptyOrNull(id))  return res.status(422).json({message: "Params invalide!",});

    db.query(Query.buildDeleteQuery("schedule", { id: id }), [id], (err, result) => {

      if (err) return res.status(500).json({ message : "Error lors de la suppression du schedule", error: err});

      res.status(200).send({ message: "Schedule supprimé avec succès", data:  result});
    });

  } catch (err) {
    console.log(err);
    res.status(500).send({message: "Erreur lors de la suppression du schedule", error: err});
  }
};

const getAll = async (req, res) => {
  try {
    db.query(QuerySchedule.buildScheduleQuery(), (err, rows) => {

      if (err) return res.status(500).json({ message: "Erreur lors de la récupération des schedule", error: err});

      res.status(200).send({ data: rows,});
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Erreur lors de la récupération des types", error: err});
  }
};

module.exports = {
  create,
  updateOne,
  deleteOne,
  getAll,
};
