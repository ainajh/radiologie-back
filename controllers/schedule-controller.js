const db = require("../db");
const Validaion = require("../utils/validations");
const Query  = require("../utils/build-query");
const QuerySchedule  = require("../utils/build-schedule-select-query");


const create = async (req, res) => {  
  try {

    const { idPerson, shift, date, idType  } = req.body;

    if ( Validaion.isEmptyOrNull(idPerson) || !Validaion.isTimeOfDay(shift) || !Validaion.isDate(date) || Validaion.isEmptyOrNull(idType)) {
      return res.status(400).json({ error: "Champ invalide!",});
    }

        
    ///
    /// need to ckeck if the user already have a schedule in the same date
    ///

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

    if (Validaion.isEmptyOrNull(id))  return res.status(400).json({error: "Params invalide!",});

    let updates =  {}
    let values =  []
    
    if(Validaion.isDate(date)) {
        updates =  {...updates, "date" : new Date(date) }
        values = [...values , updates.date]
    }
    if(Validaion.isTimeOfDay(shift)){ 
        updates =  {...updates, "shift" : shift }
        values = [...values , updates.shift]
    }
    if(!Validaion.isEmptyOrNull(idType)) {
        updates =  {...updates, "types_id" : idType }
        values = [...values , updates.types_id]
    }
    if(!Validaion.isEmptyOrNull(idPerson)) {
        updates =  {...updates, "person_id" : idPerson }
        values = [...values , updates.person_id]
    }
    
    
    const query =  Query.buildUpdateQuery("schedule", updates, {"id":id})
    values = [...values , id]
    console.log("update : ",updates, values, query)


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

    if (Validaion.isEmptyOrNull(id))  return res.status(400).json({message: "Params invalide!",});

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
