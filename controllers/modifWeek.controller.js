const db = require("../db");
const transporter = require("../mailconfig");
const { format } = require("date-fns");

const dayjs = require("dayjs");
require("dayjs/locale/fr");
dayjs.locale("fr");

const formatDateToString = (date) => {
  const dates = dayjs(date);
  return dates.format("DD MMMM YYYY");
};
const formatSemaine = (semaine) => {
  const startDate = new Date(semaine[0]);
  const endDate = new Date(semaine[1]);

  // Formater les dates
  const formattedStartDate = formatDateToString(startDate);
  const formattedEndDate = formatDateToString(endDate);

  // Concaténer les dates formatées
  return `${formattedStartDate} au ${formattedEndDate}`;
};

const create = async (req, res) => {
  const dataFromMiddleware = res.locals.userInfo;
  const { semaine, modification, valide } = req.body;

  try {
    const qry = `SELECT * FROM week_modif INNER JOIN users on users.id = week_modif.admin_id WHERE week_modif.semaine = "${semaine}"`;
    const allAdminQry = `SELECT * FROM users WHERE role = 'admin' and id != ?`;

    db.query(qry, async (err, ress) => {
      if (ress.length) {
        const planning = modification.substring(1, modification.length - 1).split(", ");
        const nbPlanning = planning.length;

        const sem = semaine.replace(/'/g, '"');

        db.query(allAdminQry, [dataFromMiddleware?.id_user], async (ers, allAdmin) => {
          const emailAdmin = allAdmin.map((item) => item.email);

          const semainFormated = formatSemaine(JSON.parse(sem));

          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: emailAdmin,
            subject: "Modification planning",
            html: `
                  <p>Madame, Monsieur, </p>
                  <p><strong style="color: red">Attention </strong><strong>${ress[0]?.nom}</strong> à <strong style="color: ${
              valide ? "green" : "red"
            }">${valide ? "validé" : "dévalidé"}</strong> le planning  de la semaine du <strong style="text-decoration: underline;">${semainFormated}</strong> </p>
                  <p>Bonne journée </p>
                  <p style="color: #652191; font-size:20px">Centres d'Imagerie Médicale </p>
                  <p style="color: #652191; font-size:20px">Radiologie91</p>
                  <div><a href="${process.env.FRONT_URL}">${process.env.FRONT_URL}<a/></div>
                  `,
          });
        });

        return res.send({
          message: "Email envoyée avec succès",
        });
      } else {
        db.query(
          "INSERT INTO week_modif (semaine, modification,admin_id) VALUES (?,?,?)",
          [semaine, modification, dataFromMiddleware?.id_user],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                error: "Erreur lors de la création du historique",
              });
            }
            return res.send({
              message: "Historique créé avec succès",
            });
          }
        );
      }
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la création du type",
    });
  }
};
module.exports = {
  create,
};
