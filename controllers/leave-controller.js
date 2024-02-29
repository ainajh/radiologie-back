const db = require("../db");
const dbPromise = require("../db-for-promise");
const Validation = require("../utils/validations");
const DateUtils = require("../utils/get-list-date-between");
const Query = require("../utils/build-query");

const create = async (req, res) => {
  try {
    const { idPerson, typeOfLeave, dateStart, dateEnd } = req.body;

    if (
      !Validation.isNumber(idPerson) &&
      Validation.isEmptyOrNull(typeOfLeave) &&
      !Validation.isDate(dateStart) &&
      !Validation.isDate(dateEnd)
    )
      return res.status(422).json({ message: "Data not processable." });

    const [isOverlap, field] = await dbPromise.query(Query.buildLeaveSelectForCheckOverlapDate(), [
      idPerson,
      new Date(dateEnd).toISOString(),
      new Date(dateEnd).toISOString(),
      new Date(dateStart).toISOString(),
      new Date(dateStart).toISOString(),
    ]);

    if (isOverlap.length > 0) return res.status(422).json({ message: "Date overlap with existing leave entry" });

    const columns = ["type_of_leave", "person_id", "date_start", "date_end"];

    const query = Query.buildInsertQuery("`leave`", columns);

    const values = [typeOfLeave, parseInt(idPerson), new Date(dateStart), new Date(dateEnd)];

    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur lors de la création de leave", error: err });
      return res.status(201).send({ message: "Leave créé avec succès", data: result });
    });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const isDisponible = async (req, res) => {
  try {
    const { idPerson, dateToCheck } = req.body;

    if (!Validation.isNumber(idPerson) && !Validation.isDate(dateToCheck))
      return res.status(422).json({ message: "Data not processable." });

    const [isOverlap, field] = await dbPromise.query(Query.buildLeaveSelectForCheckDisponibility(), [
      idPerson,
      new Date(dateToCheck).toISOString(),
      new Date(dateToCheck).toISOString(),
    ]);

    if (isOverlap.length > 0) return res.status(200).json({ isDisponible: false });
    return res.status(200).json({ isDisponible: true });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getOne = async (req, res) => {
  try {
    const personId = parseInt(req.params.personId);

    if (!Validation.isNumber(personId)) return res.status(422).json({ message: "Data not processable." });

    db.query(
      "SELECT id, person_id as idPerson, type_of_leave as typeOfLeave, date_start as dateStart, date_end as dateEnd  FROM `leave` WHERE person_id = ?",
      [personId],
      (err, results) => {
        if (err) {
          console.error("Error fetching leave entries:", err);
          res.status(500).json({ message: "Internal Server Error" });
          return;
        }

        return res.status(200).json({ data: results });
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAll = async (req, res) => {
  try {
    db.query(
      "SELECT id, person_id as idPerson, type_of_leave as typeOfLeave, date_start as dateStart, date_end as dateEnd  FROM `leave` ",
      (err, results) => {
        if (err) {
          console.error("Error fetching leave entries:", err);
          res.status(500).json({ message: "Internal Server Error" });
          return;
        }

        return res.status(200).json({ data: results });
      }
    );
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllInTwoDate = async (req, res) => {
  const { dateStart, dateEnd } = req.body;
  try {
    if (!Validation.isDate(dateStart) && !Validation.isDate(dateEnd)) return res.status(422).json({ message: "Data not processable." });
    const [isOverlap, field] = await dbPromise.query(Query.buildLeaveSelectBetweenTwoDate(), [
      new Date(dateEnd).toISOString(),
      new Date(dateEnd).toISOString(),
      new Date(dateStart).toISOString(),
      new Date(dateStart).toISOString(),
      new Date(dateStart).toISOString(),
      new Date(dateEnd).toISOString(),
      new Date(dateStart).toISOString(),
      new Date(dateEnd).toISOString(),
    ]);

    return res.status(200).json({ data: isOverlap });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const deleteOne = async (req, res) => {
  const leaveId = parseInt(req.params.leaveId);

  if (!Validation.isNumber(leaveId)) return res.status(422).json({ message: "Data not processable." });

  try {
    db.query("DELETE FROM `leave` WHERE id = ?", [leaveId], (err, result) => {
      if (err) {
        console.error("Error deleting leave entry:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      if (result.affectedRows === 0) {
        return res.status(422).json({ message: "Leave entry not found" });
      } else {
        return res.status(200).json({ message: "Leave entry deleted successfully" });
      }
    });
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateOne = async (req, res) => {
  const leaveId = parseInt(req.params.leaveId);

  const { idPerson, typeOfLeave, dateStart, dateEnd } = req.body;

  if (
    !Validation.isNumber(idPerson) &&
    !Validation.isNumber(leaveId) &&
    Validation.isEmptyOrNull(typeOfLeave) &&
    !Validation.isDate(dateStart) &&
    !Validation.isDate(dateEnd)
  )
    return res.status(422).json({ message: "Data not processable." });

  const [isOverlap, field] = await dbPromise.query(Query.buildLeaveSelectForCheckOverlapDate(), [
    idPerson,
    new Date(dateEnd).toISOString(),
    new Date(dateEnd).toISOString(),
    new Date(dateStart).toISOString(),
    new Date(dateStart).toISOString(),
  ]);

  if (isOverlap.length > 0) return res.status(422).json({ message: "Date overlap with existing leave entry" });

  db.query(
    "UPDATE `leave` SET type_of_leave = ?, date_start = ?, date_end = ? WHERE id = ?",
    [typeOfLeave, dateStart, dateEnd, leaveId],
    (err, result) => {
      if (err) {
        console.error("Error updating leave entry:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(422).json({ message: "Leave entry not found" });
      } else {
        return res.status(200).json({ message: "Leave entry updated successfully" });
      }
    }
  );
};

module.exports = {
  create,
  getOne,
  getAll,
  deleteOne,
  updateOne,
  isDisponible,
  getAllInTwoDate,
};
