const db = require("../db");

const create = async (req, res) => {
  try {
    const { nom_place } = req.body;
    if (nom_place == null || nom_place == "") {
      return res.status(400).json({
        error: "Champ invalide!",
      });
    }
    db.query("INSERT INTO places (nom_place) VALUES (?)", [nom_place], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la création du type",
        });
      }
      return res.send({
        message: "Type créé avec succès",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la création du places",
    });
  }
};

const updateOne = async (req, res) => {
  try {
    const { id, nom_place } = req.body;
    if (id == null || nom_place == null || id == "" || nom_place == "") {
      return res.status(400).json({
        error: "Champ invalide!",
      });
    }
    db.query("UPDATE places SET nom_place = ? WHERE id = ?", [nom_place, id], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la modification!",
        });
      }
      return res.send({
        message: "Modification efféctuée",
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
    const id = req.params.id;
    // Suppression du sous type
    db.query("DELETE FROM places WHERE id = ?", [id], (err, result) => {
      if (err) {
        return res.status(401).json({
          error: "Il y a des demandes liées à ce type",
        });
      }
      res.send({
        message: "Type supprimé avec succès",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la suppression du type",
    });
  }
};

const getAll = async (req, res) => {
  try {
    db.query("SELECT * FROM places", (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: "Erreur lors de la récupération des places",
        });
      }
      res.send({
        places: rows,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Erreur lors de la récupération des places",
    });
  }
};

module.exports = {
  create,
  updateOne,
  deleteOne,
  getAll,
};
