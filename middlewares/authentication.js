const db = require("../db");

const checkToken = (role) => async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        error: "Token invalide",
      });
    }
    const authorization = req.headers.authorization.split(" ");
    const token = authorization[1];
    db.query("SELECT * FROM users, tokens WHERE users.id = tokens.id_user AND token = ?", [token], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la récupération de l'utilisateur connecté",
        });
      }
      if (!results.length) {
        return res.status(401).json({
          error: "Token invalide",
        });
      }

      if (!role.includes(results[0].role)) {
        return res.status(401).json({
          error: "Vous n'êtes pas autorisé à accéder à cette ressource",
        });
      }
      res.locals.userInfo = results[0];
      next();
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

module.exports = checkToken;
