const db = require("../db");
const jwt = require("jsonwebtoken");
const transporter = require("../mailconfig");
const path = require("path");
const { socket: io } = require("../socket");
const fs = require("fs");

const formaDate = (dateString) => {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

const create = async (req, res) => {
  try {
    const { nom_patient, datenais, tel, rdv, id_type, id_medecin, code } =
      req.body;
    if (
      !nom_patient ||
      !datenais ||
      !tel ||
      !code ||
      nom_patient === "" ||
      datenais === "" ||
      tel === "" ||
      code === ""
    ) {
      return res.status(401).json({
        error: "Veuillez remplir tous les champs",
      });
    }
    const email = req.body.email !== "null" ? req.body.email : null;
    const files = req.file ? `/files/${req.file.filename}` : null;
    const rendez_vous = rdv === "null" ? null : rdv;
    const medecin = id_medecin === "null" ? null : id_medecin;
    if (!medecin) {
      db.query(
        "SELECT code FROM codes WHERE email = ? AND code = ?",
        [email, code],
        (err, result) => {
          if (err || result.length === 0) {
            return res.status(401).json({
              error: "Code invalide",
            });
          }
          db.query(
            "DELETE FROM codes WHERE email = ? AND code = ?",
            [email, code],
            (err1, result1) => {
              if (err1) {
                return res.status(500).json({
                  error: "Erreur lors de la suppression du code",
                });
              }
            }
          );
          db.query(
            "INSERT INTO demandes (nom_patient, email, datenais, tel, rdv, id_type, id_medecin, ordonnance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              nom_patient,
              email,
              datenais,
              tel,
              rendez_vous,
              id_type,
              medecin,
              files,
            ],
            async (err2, result2) => {
              if (err2) {
                return res.status(500).json({
                  error: "Erreur lors de la création de la demande",
                  message: err2,
                });
              }
              const linktoken = jwt.sign(
                { id: result2.insertId },
                process.env.JWT_SECRET
              );
              try {
                if (email) {
                  const info = await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: email,
                    subject: "Demande radiologie",
                    html: `
                    <p>Madame, Monsieur, </p>
                    <p>Votre demande de rendez-vous a été prise en compte.</p>
                    <p>L'équipe médicale prendra contact avec vous prochainement, afin de programmer votre rendez-vous dans le délai souhaité.</p>
                    <p>Pour annuler la demande, veuillez cliquer ce bouton
                    <a href="${process.env.DOMAIN}/api/delete/demande?token=${linktoken}">Supprimer la demande</a> </p>
                    
              <p style="color: #652191; font-size:20px">Centres d'Imagerie Médicale </p>
              <p style="color: #652191; font-size:20px">Radiologie91</p>
              <div><a href="${process.env.FRONT_URL}">${process.env.FRONT_URL}<a/></div>
          `,
                  });
                }
                io.emit("get demande");
                res.send({
                  message: "Demande ajoutée avec succès",
                  id: result2.insertId,
                });
              } catch (error) {
                console.log(error);
                res.status(500).send({ error: "Erreur de l'envoi de l'email" });
              }
            }
          );
        }
      );
    } else {
      db.query(
        "INSERT INTO demandes (nom_patient, email, datenais, tel, rdv, id_type, ordonnance, id_medecin) VALUES (?, ?, ?, ?, ?, ?,?, ?)",
        [
          nom_patient,
          email,
          datenais,
          tel,
          rendez_vous,
          id_type,
          files,
          medecin,
        ],
        async (err2, result2) => {
          if (err2) {
            console.log(err2);
            return res.status(500).json({
              error: "Erreur lors de la création de la demande",
              message: err2,
            });
          }
          const linktoken = jwt.sign(
            { id: result2.insertId },
            process.env.JWT_SECRET
          );
          try {
            if (email) {
              const info = await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: "Demande radiologie",
                html: `
                  <p>Madame, Monsieur, </p>
                  <p>Votre demande de rendez-vous a été prise en compte.</p>
                  <p>L'équipe médicale prendra contact avec vous prochainement, afin de programmer votre rendez-vous dans le délai souhaité.</p>
                  <p>Pour annuler la demande, veuillez cliquer ce bouton
                  <a href="${process.env.DOMAIN}/api/delete/demande?token=${linktoken}">Supprimer la demande</a> </p>
                  
              <p style="color: #652191; font-size:20px">Centres d'Imagerie Médicale </p>
              <p style="color: #652191; font-size:20px">Radiologie91</p>
              <div><a href="${process.env.FRONT_URL}">${process.env.FRONT_URL}<a/></div>
                `,
              });
            }
            io.emit("get demande");
            res.send({
              message: "Demande ajoutée avec succès",
              id: result2.insertId,
            });
          } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Erreur de l'envoi de l'email" });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la création de la demande",
    });
  }
};

const deleteFromEmail = async (req, res) => {
  try {
    const token = req.query.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        error: "Requête invalide !",
      });
    }
    db.query(
      "SELECT * FROM demandes WHERE id = ?",
      [decodedToken.id],
      (err, result) => {
        if (err || result.length === 0) {
          return res.status(401).json({
            error: "Demande inconnue",
          });
        }
        if (result[0].ordonnance) {
          fs.unlinkSync(
            path.join(__dirname, `../upload${result[0].ordonnance}`)
          );
        }
        db.query(
          "DELETE FROM demandes WHERE id = ?",
          [decodedToken.id],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                error: "Erreur lors de la suppression de la demande",
              });
            }
            io.emit("get demande");
            res.sendFile(path.join(__dirname, "../views/deleteDemande.html"));
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Erreur lors de la suppression de la demande",
    });
  }
};

const sendCodeConfirmation = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email === "") {
      return res.status(401).json({
        error: "Veuillez remplir tous les champs",
      });
    }
    const code = Math.floor(Math.random() * 1000000);
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Code de confirmation",
      text: `Votre code de confirmation est ${code}`,
    });
    console.log(code);
    db.query(
      "INSERT INTO codes (email, code) VALUES (?, ?)",
      [email, code],
      async (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la création du code",
          });
        }
        return res.send({
          message: "Code envoyé avec succès",
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de l'envoi du code",
    });
  }
};

const getAll = async (req, res) => {
  try {
    db.query(
      "SELECT CONCAT( '[', GROUP_CONCAT( JSON_OBJECT('id', commentaires.id, 'content', commentaires.content, 'created', commentaires.created) SEPARATOR ',' ), ']' ) AS comments, demandes.id, COALESCE(users.role, NULL) AS role_user, demandes.nom_patient, demandes.email AS email, demandes.datenais, demandes.ordonnance, demandes.tel, demandes.created_at, demandes.rdv, COALESCE(users.nom, NULL) AS nom_medecin, types.nom_type, types.nom_sous_type, demandes.lieu, demandes.date_rdv FROM demandes INNER JOIN types ON demandes.id_type = types.id LEFT JOIN users ON demandes.id_medecin = users.id LEFT JOIN commentaires ON demandes.id = commentaires.id_demande GROUP BY demandes.id ORDER BY demandes.created_at DESC",
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: "Erreur lors de la récupération des demandes",
          });
        }
        return res.send({
          demandes: result,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la récupération des demandes",
    });
  }
};
const getMine = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        error: "Requête invalide !",
      });
    }
    const id_medecin = decodedToken.id;
    db.query(
      "SELECT demandes.id, nom_patient, email, datenais, tel, created_at, rdv, id_medecin, nom_type, nom_sous_type, lieu, date_rdv FROM demandes, types WHERE demandes.id_type = types.id AND id_medecin = ?",
      [id_medecin],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la récupération des demandes",
          });
        }
        return res.send({
          demandes: result,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la récupération des demandes",
    });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { id, lieu, date_rdv } = req.body;
    if (!lieu || !date_rdv || lieu === "" || date_rdv === "") {
      return res.status(401).json({
        error: "Veuillez remplir tous les champs",
      });
    }
    db.query(
      "UPDATE demandes SET lieu = ?, date_rdv = ? WHERE id = ?",
      [lieu, date_rdv, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la modification du statut",
          });
        } else {
          db.query(
            "SELECT d.email, d.nom_patient, d.lieu, d.date_rdv, t.nom_type, t.nom_sous_type FROM demandes d INNER JOIN types t ON d.id_type = t.id WHERE d.id = ?",
            [id],
            async (err, result) => {
              if (err || result.length === 0) {
                return res.status(401).json({
                  error: "Demande inconnu",
                });
              } else {
                const {
                  email,
                  nom_patient,
                  lieu,
                  date_rdv,
                  nom_type,
                  nom_sous_type,
                } = result[0];
                try {
                  if (email) {
                    const info = await transporter.sendMail({
                      from: process.env.SMTP_USER,
                      to: email,
                      subject: "Demande radiologie",
                      html: `
              <p> Bonjour ${nom_patient}, nous sommes ravis de vous confirmer votre rendez-vous pour l'examen d’imagerie médical ${nom_type} avec le type d'examen ${nom_sous_type}  le ${formaDate(
                        date_rdv
                      )}. Votre rendez-vous se tiendra à notre établissement situé à ${lieu}. Nous avons hâte de vous y accueillir.</p>
            `,
                    });
                  }
                } catch (error) {
                  console.log(error);
                  res
                    .status(500)
                    .send({ error: "Erreur de l'envoi de l'email" });
                }
              }
            }
          );
          res.send({
            message: "Statut modifié avec succès",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la modification du statut",
    });
  }
};
const updateInfo = async (req, res) => {
  try {
    const { id, nom_patient, email, tel, datenais } = req.body;
    if (!nom_patient || !tel || datenais === "") {
      return res.status(401).json({
        error: "Veuillez remplir tous les champs",
      });
    }
    db.query(
      "UPDATE demandes SET nom_patient = ?, email = ?, datenais = ?, tel = ? WHERE id = ?",
      [nom_patient, email, datenais, tel, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la modification des informations",
          });
        }
        return res.send({
          message: "Information modifié avec succès",
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la modification des informations",
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    db.query(
      "SELECT d.email, d.date_rdv, d.ordonnance FROM demandes d WHERE d.id = ?",
      [id],
      async (err, result) => {
        if (err || result.length === 0) {
          return res.status(401).json({
            error: "Demande inconnue",
          });
        } else {
          const { email, ordonnance } = result[0];
          try {
            if (email) {
              await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: "Suppression du demande en radiologie",
                html: `
                <p>Madame, Monsieur, </p>
                <p>Nous regrettons de ne pouvoir donner suite à votre demande de rendez-vous dans le délai souhaité. </p>
                <p>Nous vous remercions de votre compréhension. </p>
                <p>Bonne journée </p>
                
              <p style="color: #652191; font-size:20px">Centres d'Imagerie Médicale </p>
              <p style="color: #652191; font-size:20px">Radiologie91</p>
              <div><a href="${process.env.FRONT_URL}">${process.env.FRONT_URL}<a/></div>
              `,
              });
            }
            if (ordonnance) {
              fs.unlinkSync(path.join(__dirname, `../upload${ordonnance}`));
            }
            db.query(
              "DELETE FROM demandes WHERE id = ?",
              [id],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    error: "Erreur lors de la suppression de la demande",
                  });
                } else {
                  io.emit("get demande");
                  res.send({
                    message: "Demande supprimée avec succès",
                  });
                }
              }
            );
          } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Erreur de l'envoi de l'email" });
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la suppression de la demande",
    });
  }
};

const deleteMine = async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        error: "Requête invalide !",
      });
    }
    db.query(
      "DELETE FROM demandes WHERE id = ?",
      [decodedToken.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la suppression de la demande",
          });
        }
        io.emit("get demande");
        res.send({
          message: "Demande supprimée avec succès",
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la suppression de la demande",
    });
  }
};

function getMonthIndex(month) {
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  return months.indexOf(month);
}

const getStats = async (req, res) => {
  const sql =
    "SELECT types.nom_type AS nom_type, CASE WHEN MONTH(created_at) = 1 THEN 'janvier' WHEN MONTH(created_at) = 2 THEN 'février' WHEN MONTH(created_at) = 3 THEN 'mars' WHEN MONTH(created_at) = 4 THEN 'avril' WHEN MONTH(created_at) = 5 THEN 'mai' WHEN MONTH(created_at) = 6 THEN 'juin' WHEN MONTH(created_at) = 7 THEN 'juillet' WHEN MONTH(created_at) = 8 THEN 'août' WHEN MONTH(created_at) = 9 THEN 'septembre' WHEN MONTH(created_at) = 10 THEN 'octobre' WHEN MONTH(created_at) = 11 THEN 'novembre' ELSE 'décembre' END AS mois, COUNT(*) AS nombre_demandes FROM demandes INNER JOIN types ON demandes.id_type = types.id GROUP BY types.nom_type, MONTH(created_at) ORDER BY types.nom_type, MONTH(created_at)";
  try {
    db.query(sql, (err, result) => {
      const input = result;
      let output = [];
      let dataByType = {};

      // Remplissage de l'objet avec les données de l'entrée
      input.forEach((entry) => {
        const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        if (!dataByType[entry.nom_type]) {
          dataByType[entry.nom_type] = {
            label: entry.nom_type,
            backgroundColor: color,
            borderColor: color, // Génération d'une couleur aléatoire
            data: Array(12).fill(0), // Remplissage d'un tableau de 12 éléments avec des zéros pour chaque mois
          };
        }
        const monthIndex = getMonthIndex(entry.mois); // Fonction pour obtenir l'index du mois dans le tableau (0 pour janvier, 1 pour février, etc.)
        dataByType[entry.nom_type].data[monthIndex] = entry.nombre_demandes; // Mise à jour du nombre de demandes pour le mois spécifique
      });
      output = Object.values(dataByType);

      res.send({
        statistiqueDemandes: output,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de requete pour les statistiques",
    });
  }
};

const getStatsMed = async (req, res) => {
  const sql =
    "SELECT u.nom AS medecin, COUNT(*) AS nombre_demandes, SUM(CASE WHEN MONTH(d.created_at) = MONTH(CURDATE()) THEN 1 ELSE 0 END) AS demandes_ce_mois, SUM(CASE WHEN WEEK(d.created_at) = WEEK(CURDATE()) THEN 1 ELSE 0 END) AS demandes_cette_semaine, SUM(CASE WHEN YEAR(d.created_at) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS demandes_cette_annee FROM demandes d INNER JOIN users u ON d.id_medecin = u.id GROUP BY id_medecin, u.nom;";
  try {
    db.query(sql, (err, result) => {
      res.send({
        statistiqueDemandes: result,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de requete pour les statistiques",
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { id_demande, content } = req.body;
    if (!content || content === "") {
      return res.status(401).json({
        error: "Veuillez remplir tous les champs",
      });
    }
    db.query(
      "INSERT INTO commentaires (id_demande, content) VALUES (?, ?)",
      [id_demande, content],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de l'ajout du commentaire",
          });
        }
        io.emit("get demande");
        res.send({
          message: "Commentaire ajouté avec succès",
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la modification du commentaire",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    db.query("DELETE FROM commentaires WHERE id = ?", [id], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la suppression du commentaire",
        });
      }
      io.emit("get demande");
      res.send({
        message: "Commentaire supprimé avec succès",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la suppression du commentaire",
    });
  }
};

module.exports = {
  create,
  getAll,
  getMine,
  changeStatus,
  deleteOne,
  deleteMine,
  deleteFromEmail,
  sendCodeConfirmation,
  getStats,
  getStatsMed,
  addComment,
  deleteComment,
  updateInfo
};
