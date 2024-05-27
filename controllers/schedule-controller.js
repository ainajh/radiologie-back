const db = require("../db");
const dbPromise = require("../db-for-promise");
const Validation = require("../utils/validations");
const DateUtils = require("../utils/get-list-date-between");
const Query = require("../utils/build-query");
const QuerySchedule = require("../utils/build-schedule-select-query");
const { v4: uuidv4 } = require("uuid");

const create = async (req, res) => {
  try {
    const { idPerson, shift, date, message, idType, typeOfSchedule, dateStart, dateEnd } = req.body;

    if (
      Validation.isEmptyOrNull(idPerson) ||
      !Validation.isTimeOfDay(shift) ||
      Validation.isEmptyOrNull(idType) ||
      !Validation.isNumber(typeOfSchedule)
    ) {
      return res.status(422).json({ message: "Champ invalide!" });
    }

    // creation schedule for type working day
    if (!Validation.isDate(date)) return res.status(422).json({ message: "Champ invalide!" });
    const [rows, fields] = await dbPromise.query(
      Query.buildSelectQuery("schedule", "*", {
        "schedule.date": null,
        "schedule.person_id": null,
        "schedule.shift": null,
      }),
      [new Date(date).toISOString(), idPerson, shift]
    );

    if (rows.length > 0) {
      return res.status(422).json({
        message: "Impossible de modifier le planning car le médecin est déjà programmé sur le même créneau horaire ",
      });
    }

    const [isOverlap, field] = await dbPromise.query(Query.buildLeaveSelectForCheckDisponibility(), [
      idPerson,
      new Date(date).toISOString(),
      new Date(date).toISOString(),
    ]);

    if (isOverlap.length > 0)
      return res.status(422).json({
        message: "Impossible de modifier le planning car le médecin est en congé ",
      });

    const columns = ["date", "message", "shift", "types_id", "person_id", "type_of_schedule"];

    const query = Query.buildInsertQuery("schedule", columns);

    db.query(query, [new Date(date), message, shift, idType, idPerson, typeOfSchedule], (err, result) => {
      if (err)
        return res.status(500).json({
          message: "Erreur lors de la création du schedule",
          error: err,
        });

      return res.status(201).send({
        message: "Schedule créé avec succès",
        data: result,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Erreur lors de la création du type", error: err });
  }
};

const updateOne = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, shift, message, idType, idPerson, is_valid } = req.body;

    console.log("bod ", req.body);

    if (Validation.isEmptyOrNull(id)) return res.status(422).json({ message: "Params invalide!" });

    let updates = {};
    let select = {};
    let selectedValues = [];
    let values = [];

    if (!Validation.isEmptyOrNull(message)) {
      updates = { ...updates, message: message };
      select = { ...select, "schedule.message": message };
      selectedValues = [...selectedValues, message];
      values = [...values, message];
    }

    if (Validation.isDate(date)) {
      updates = { ...updates, date: new Date(date) };
      select = { ...select, "schedule.date": new Date(date).toISOString() };
      selectedValues = [...selectedValues, new Date(date).toISOString()];
      values = [...values, new Date(date)];
    }

    if (Validation.isTimeOfDay(shift)) {
      updates = { ...updates, shift: shift };
      select = { ...select, "schedule.shift": shift };
      selectedValues = [...selectedValues, shift];
      values = [...values, updates.shift];
    }

    if (!Validation.isEmptyOrNull(idPerson)) {
      updates = { ...updates, person_id: idPerson };
      select = { ...select, "schedule.person_id": idPerson };
      selectedValues = [...selectedValues, idPerson];
      values = [...values, updates.person_id];
    }

    if (!Validation.isEmptyOrNull(idType)) {
      updates = { ...updates, types_id: idType };
      select = { ...select, "schedule.types_id": idType };
      selectedValues = [...selectedValues, idType];
      values = [...values, updates.types_id];
    }

    const [rows, fields] = await dbPromise.query(Query.buildSelectQuery("schedule", "*", select), values);

    if (rows.length > 0) {
      return res.status(422).json({ message: "Impossible de mettre a jour le planning" });
    }

    const [isOverlap, field] = await dbPromise.query(Query.buildLeaveSelectForCheckDisponibility(), [
      idPerson,
      new Date(date).toISOString(),
      new Date(date).toISOString(),
    ]);

    if (isOverlap.length > 0)
      return res.status(422).json({
        message: "Impossible de modifier le planning car le médecin est en congé ",
      });

    const [rowsSecond, fieldsSecond] = await dbPromise.query(Query.buildSelectQuery("schedule", "*", { "schedule.id": id }), [id]);

    if (rowsSecond.length === 0) {
      return res.status(422).json({ message: "Impossible de mettre a jour le planning" });
    }

    if (new Date(rowsSecond[0].date).toLocaleDateString() != updates.date.toLocaleDateString() || rowsSecond[0].shift != updates.shift) {
      delete select["schedule.types_id"];
      selectedValues.pop();
      const [rowsFird, fieldsFird] = await dbPromise.query(Query.buildSelectQuery("schedule", "*", select), selectedValues);
      if (rowsFird.length > 0) {
        return res.status(422).json({ message: "Impossible de mettre a jour le planning" });
      }
    }

    updates = { ...updates, type_of_schedule: 0, is_valid };
    values = [...values, updates.type_of_schedule, is_valid];

    const query = Query.buildUpdateQuery("schedule", updates, { id: id });
    values = [...values, id];
    console.log("query", query);

    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur lors de la modification!", error: err });
      return res.status(200).send({
        message: "Modification efféctuée",
        data: result,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Erreur lors de la modification du schedule",
      error: err,
    });
  }
};
const getAllSheduleThisWeek = async (req, res) => {
  const datesInSQLFormat = req.body?.map((date) => `'${date}'`).join(", ");
  try {
    db.query(`SELECT id ,is_valid  FROM schedule  WHERE DATE(date) IN (${datesInSQLFormat})`, (err, rows) => {
      if (err) {
        console.log();
        return res.status(500).json({
          error: "Erreur lors de la récupération des types",
        });
      }
      res.send({
        schedule: rows,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Erreur lors de la récupération des types",
    });
  }
};

const toogleValidationPlanning = async (req, res) => {
  try {
    const { id } = req.params;
    const { validate } = req.query;

    if (id == null) {
      return res.status(400).json({
        error: "Champ invalide!",
      });
    }
    db.query("UPDATE schedule SET is_valid = ? WHERE id = ?", [validate == "true" ? 1 : 0, id], async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: "Erreur lors de la modification!",
        });
      }

      db.query("SELECT * FROM schedule WHERE id = ?", [id], (err, rows) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la récupération du planning",
          });
        }

        return res.send({
          message: "Modification efféctuée",
          data: rows,
        });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la modification du Type",
    });
  }
};
const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (Validation.isEmptyOrNull(id)) return res.status(422).json({ message: "Params invalide!" });

    db.query(Query.buildDeleteQuery("schedule", { id: id }), [id], (err, result) => {
      if (err)
        return res.status(500).json({
          message: "Error lors de la suppression du schedule",
          error: err,
        });

      res.status(200).send({ message: "Schedule supprimé avec succès", data: result });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Erreur lors de la suppression du schedule",
      error: err,
    });
  }
};

const getAll = async (req, res) => {
  try {
    db.query(QuerySchedule.buildScheduleQuery(), (err, rows) => {
      if (err)
        return res.status(500).json({
          message: "Erreur lors de la récupération des scheduless",
          error: err,
        });

      res.status(200).send({ data: rows });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Erreur lors de la récupération des types",
      error: err,
    });
  }
};

const copyPaste = async (req, res) => {
  try {
    const { copyDate, pasteDate } = req.body;

    if (!Validation.isDate(copyDate[0]) && !Validation.isDate(copyDate[1]) && !Validation.isDate(pasteDate[0]) && !Validation.isDate([1]))
      return res.status(422).json({ message: "Data not processable." });

    const [dataToCopy, fields] = await dbPromise.query(QuerySchedule.selectDataBetweenDatesQuery, [
      new Date(copyDate[0]).toISOString(),
      new Date(copyDate[1]).toISOString(),
    ]);

    const columns = [
      "date",
      // "message",
      "shift",
      "types_id",
      "person_id",
      "type_of_schedule",
      "copied_id",
    ];

    const query = Query.buildInsertQuery("schedule", columns);

    const dateListToCopy = DateUtils.getDates(copyDate[0], copyDate[1]);
    const dateListToPaste = DateUtils.getDates(pasteDate[0], pasteDate[1]);

    const copiedId = uuidv4();

    for (e in dateListToCopy) {
      for (i in dataToCopy) {
        dataToCopy[i].typeOfSchedule = 0;

        const [rows, fields] = await dbPromise.query(
          Query.buildSelectQuery("schedule", "*", {
            "schedule.date": null,
            "schedule.person_id": null,
            "schedule.shift": null,
          }),
          [new Date(dateListToPaste[e]).toISOString(), dataToCopy[i].idPerson, dataToCopy[i].shift]
        );

        if (rows.length > 0) {
          dataToCopy[i].typeOfSchedule = 1;
          console.log(dataToCopy[i]);
        }

        const date = new Date(dateListToPaste[e]);

        // Get today's date
        const today = new Date();

        if (date < today) {
          continue;
        }

        if (new Date(dataToCopy[i].date).toLocaleDateString() === new Date(dateListToCopy[e]).toLocaleDateString()) {
          const [isOverlap, field] = await dbPromise.query(Query.buildLeaveSelectForCheckDisponibility(), [
            dataToCopy[i].idPerson,
            new Date(dateListToPaste[e]).toISOString(),
            new Date(dateListToPaste[e]).toISOString(),
          ]);

          if (isOverlap.length > 0) {
            dataToCopy[i].typeOfSchedule = 1;
          }

          await dbPromise.query(query, [
            new Date(dateListToPaste[e]),
            // dataToCopy[i].message,
            dataToCopy[i].shift,
            dataToCopy[i].idType,
            dataToCopy[i].idPerson,
            dataToCopy[i].typeOfSchedule,
            copiedId,
          ]);
        }
      }
    }

    return res.status(200).json({ data: { copiedId }, message: "Schedule copied successfully! " });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error on copyPate! " });
  }
};

const undoCopyPaste = (req, res) => {
  const { copiedId } = req.params;
  if (Validation.isEmptyOrNull(copiedId)) return res.status(422).json({ message: "Params invalide!" });

  const undoQuery = `DELETE FROM schedule WHERE  copied_id = ?`;

  try {
    db.query(undoQuery, [copiedId], (err, result) => {
      if (err)
        return res.status(500).json({
          message: "Error when undo change",
          error: err,
        });

      res.status(200).send({ message: "Undo change successfuly", data: result });
    });
  } catch (e) {
    return res.status(500).json({ message: "Error on undo copyPate! " });
  }
};

module.exports = {
  create,
  updateOne,
  deleteOne,
  getAll,
  copyPaste,
  undoCopyPaste,
  toogleValidationPlanning,
  getAllSheduleThisWeek,
};
