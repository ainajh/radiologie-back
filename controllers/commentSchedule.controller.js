const db = require("../db");

const create = async (req, res) => {
  try {
    const { id_sender, comment } = req.body;
    if (id_sender == null || comment == null) {
      return res.status(400).json({
        error: "Champ invalide!",
      });
    }
    db.query("INSERT INTO commentaire_schedule (id_sender, comment) VALUES (?, ?)", [id_sender, comment], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la création du commentaire",
        });
      }
      return res.send({
        message: "Succès",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la création du commentaire",
    });
  }
};

// const updateOne = async (req, res) => {
//   try {
//     const { id, nom_type, nom_sous_type } = req.body;
//     if (id == null || nom_type == null || nom_sous_type == null || id == "" || nom_type == "" || nom_sous_type == "") {
//       return res.status(400).json({
//         error: "Champ invalide!",
//       });
//     }
//     db.query("UPDATE types SET nom_type = ?, nom_sous_type = ? WHERE id = ?", [nom_type, nom_sous_type, id], (err, result) => {
//       if (err) {
//         return res.status(500).json({
//           error: "Erreur lors de la modification!",
//         });
//       }
//       return res.send({
//         message: "Modification efféctuée",
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       error: "Erreur lors de la modification du Type",
//     });
//   }
// };

// const deleteOne = async (req, res) => {
//   try {
//     const id = req.params.id;
//     // Suppression du sous type
//     db.query("DELETE FROM types WHERE id = ?", [id], (err, result) => {
//       if (err) {
//         return res.status(401).json({
//           error: "Il y a des demandes liées à ce type",
//         });
//       }
//       res.send({
//         message: "Type supprimé avec succès",
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       error: "Erreur lors de la suppression du type",
//     });
//   }
// };

const getAll = async (req, res) => {
  const datesInSQLFormat = req.body?.map((date) => `'${date}'`).join(", ");
  try {
    db.query(
      `SELECT * FROM commentaire_schedule cs INNER JOIN users us on cs.id_sender = us.id  WHERE DATE(created_at) IN (${datesInSQLFormat}) ORDER BY cs.created_at ASC`,
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la récupération des types",
          });
        }
        res.send({
          commentaire: rows,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Erreur lors de la récupération des types",
    });
  }
};

module.exports = {
  create,
  //   updateOne,
  //   deleteOne,
  getAll,
};
