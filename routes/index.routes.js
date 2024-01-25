const router = require("express").Router();
const demandeController = require("../controllers/demandeController");
const db = require("../db");

router
  .get("/delete/demande", demandeController.deleteFromEmail)
  .use("/user", require("./user.routes"))
  .use("/demande", require("./demande.routes"))
  .use("/type", require("./type.routes"))
  .get("/message/getmessagenonlu", async (req, res) => {
    const { id } = req.query;
    try {
      db.query(
        "SELECT * FROM messages WHERE id_receveur = ? AND lu = 0 GROUP BY id_envoyeur",
        [id],
        (err, rows) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          }
          res.send({count: rows.length});
        }
      );
    } catch (error) {
      console.log(error)
      res.status(500).send(error);
    }
  });

module.exports = router;
