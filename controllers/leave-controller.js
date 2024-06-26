const db = require("../db");
const dbPromise = require("../db-for-promise");
const Validation = require("../utils/validations");
const DateUtils = require("../utils/get-list-date-between");
const Query = require("../utils/build-query");

const create = async (req, res) => {
  const { idPerson, typeOfLeave, dateStart, dateEnd } = req.body;
  const dataFromMiddleware = res.locals.userInfo;
  try {
    db.query(
      `SELECT * FROM week_modif 
      WHERE 
      '${dateStart}' BETWEEN SUBSTRING_INDEX(SUBSTRING_INDEX(semaine, "', '", 1), "'", -1) AND SUBSTRING_INDEX(SUBSTRING_INDEX(semaine, "', '", -1), "'", 1) AND is_valid = 1
      OR
      '${dateEnd}' BETWEEN SUBSTRING_INDEX(SUBSTRING_INDEX(semaine, "', '", 1), "'", -1) AND SUBSTRING_INDEX(SUBSTRING_INDEX(semaine, "', '", -1), "'", 1) AND is_valid = 1
      `,
      async (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Il y a une erreur lors de l'ajout congé" });
        } else {
          console.log(result.length);
          if (result?.length) {
            const message =
              dataFromMiddleware.role == "admin"
                ? "Médecin en vacation cette semaine, merci de dévalider le planning"
                : "Vous êtes en vacation cette semaine, merci de demander à l’administrateur de dévalider la semaine de travail. ";
            return res.status(422).json({ error: true, message });
          } else {
            if (
              !Validation.isNumber(idPerson) &&
              Validation.isEmptyOrNull(typeOfLeave) &&
              !Validation.isDate(dateStart) &&
              !Validation.isDate(dateEnd)
            )
              return res.status(422).json({ error: true, message: "Data not processable." });

            const [isOverlap, field] = await dbPromise.query(Query.buildLeaveSelectForCheckOverlapDate(), [
              idPerson,
              new Date(dateEnd).toISOString(),
              new Date(dateEnd).toISOString(),
              new Date(dateStart).toISOString(),
              new Date(dateStart).toISOString(),
            ]);

            if (isOverlap.length > 0) return res.status(422).json({ message: "Chevauchement de dates avec une entrée de congé existante" });

            const columns = ["type_of_leave", "person_id", "date_start", "date_end"];

            const query = Query.buildInsertQuery("`leave`", columns);

            const values = [typeOfLeave, parseInt(idPerson), new Date(dateStart), new Date(dateEnd)];

            db.query(query, values, (err, result) => {
              if (err) return res.status(500).json({ message: "Erreur lors de la création du congé", error: err });
              return res.status(201).send({ message: "Congés crées  avec succès", data: result });
            });
          }
        }
      }
    );
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
      "SELECT lv.id, lv.person_id AS idPerson, us.nom AS nom, lv.type_of_leave AS typeOfLeave, lv.date_start AS dateStart, lv.date_end AS dateEnd FROM `leave` AS lv INNER JOIN users AS us ON lv.person_id = us.id ",
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
const getMyLeave = async (req, res) => {
  const { idUser } = req.params;
  try {
    db.query(
      `SELECT lv.id, lv.person_id AS idPerson, us.nom AS nom, lv.type_of_leave AS typeOfLeave, lv.date_start AS dateStart, lv.date_end AS dateEnd FROM \`leave\` AS lv INNER JOIN users AS us ON lv.person_id = us.id WHERE us.id = ${idUser}`,
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
        return res.status(422).json({ message: "Congé non trouvé" });
      } else {
        return res.status(200).json({ message: "Suppression du congé avec succès" });
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

  // if (isOverlap.length > 0) return res.status(422).json({ message: "Chevauchement de dates avec une entrée de congé existante" });

  db.query(
    "UPDATE `leave` SET type_of_leave = ?, person_id=?, date_start = ?, date_end = ? WHERE id = ?",
    [typeOfLeave, idPerson, dateStart, dateEnd, leaveId],
    (err, result) => {
      if (err) {
        console.error("Error updating leave entry:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(422).json({ message: "Congé non trouvé" });
      } else {
        return res.status(200).json({ message: "Modification du congé avec succès" });
      }
    } //
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
  getMyLeave,
};
