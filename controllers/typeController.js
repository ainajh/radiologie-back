const db = require("../db");

const create = async (req, res) => {
  try {
    const { nom_type, nom_sous_type } = req.body;
    if (
      nom_type == null ||
      nom_sous_type == null ||
      nom_type == "" ||
      nom_sous_type == ""
    ) {
      return res.status(400).json({
        error: "Champ invalide!",
      });
    }
    db.query(
      "INSERT INTO types (nom_type, nom_sous_type) VALUES (?, ?)",
      [nom_type, nom_sous_type],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la création du type",
          });
        }
        return res.send({
          message: "Type créé avec succès",
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la création du type",
    });
  }
};

const updateOne = async (req, res) => {
  try {
    const { id, nom_type, nom_sous_type } = req.body;
    if (
      id == null ||
      nom_type == null ||
      nom_sous_type == null ||
      id == "" ||
      nom_type == "" ||
      nom_sous_type == ""
    ) {
      return res.status(400).json({
        error: "Champ invalide!",
      });
    }
    db.query(
      "UPDATE types SET nom_type = ?, nom_sous_type = ? WHERE id = ?",
      [nom_type, nom_sous_type, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la modification!",
          });
        }
        return res.send({
          message: "Modification efféctuée",
        });
      }
    );
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
    db.query("DELETE FROM types WHERE id = ?", [id], (err, result) => {
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
    db.query("SELECT * FROM types", (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la récupération des types",
        });
      }
      res.send({
        types: rows,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Erreur lors de la récupération des types",
    });
  }
};

module.exports = {
  create,
  updateOne,
  deleteOne,
  getAll,
};
