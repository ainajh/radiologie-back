const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../mailconfig");

const create = async (req, res) => {
  try {
    const { nom, tel, email, adresse, rpps, role } = req.body;
    if (
      !nom ||
      !tel ||
      !adresse ||
      !email ||
      !rpps ||
      nom.length === 0 ||
      tel.length === 0 ||
      adresse.length === 0 ||
      email.length === 0 ||
      rpps.length === 0 ||
      role === null
    ) {
      return res.status(500).send({
        error: "Champ invalide",
      });
    }
    //hashage du mot de passe
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Compte radiologie",
      html: `
          <p>Bonjour ${nom},</p>
          <p>Votre compte vient d'être créé, voici votre mot de passe <strong>${password}</strong></p>
        `,
    });
    //insertion dans la base de données
    db.query(
      "INSERT INTO users (nom, tel, email, password, adresse, rpps, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 1)",
      [nom, tel, email, hashedPassword, adresse, rpps, role],
      async (err, result) => {
        console.log(err);
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: "Erreur lors de la création de l'utilisateur",
            result: err,
          });
        }
        return res.send({
          message: "Utilisateur créé avec succès",
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la création de l'utilisateur",
    });
  }
};

const updateOne = async (req, res) => {
  try {
    const { id, nom, adresse, tel, rpps, role } = req.body;
    db.query(
      "UPDATE users SET nom = ?, tel = ?, adresse = ?, rpps = ?, role = ? WHERE id = ?",
      [nom, tel, adresse, rpps, role, id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: "Erreur lors de la modification de l'utilisateur",
          });
        }
        return res.send({
          message: "Utilisateur modifié avec succès",
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la modification de l'utilisateur",
    });
  }
};

const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;

    // Suppression de l'utilisateur
    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la suppression de l'utilisateur",
        });
      }
      res.send({
        message: "Utilisateur supprimé avec succès",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la suppression de l'utilisateur",
    });
  }
};

const signup = async (req, res) => {
  try {
    const { nom, tel, adresse, email, password, rpps } = req.body;
    if (
      !nom ||
      !tel ||
      !adresse ||
      !email ||
      !password ||
      !rpps ||
      nom.length === 0 ||
      tel.length === 0 ||
      adresse.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      rpps.length === 0
    ) {
      return res.status(500).send({
        error: "Champ invalide",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (nom, tel, adresse, email, password, rpps, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, 'medecin', 0)",
      [nom, tel, adresse, email, hashedPassword, rpps],
      (err, result) => {
        if (err) {
          if (err.errno === 1062) {
            return res.status(500).send({
              error: "L'email existe déjà",
            });
          }
          return res.status(500).json({
            error: "Erreur lors de la création de l'utilisateur",
          });
        }
        return res.send({
          message: "Compte créé, en attente de vérification",
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Erreur lors de la création de l'utilisateur",
    });
  }
};

const login = async (req, res) => {
  const role = req.params.role;
  try {
    const { email, password } = req.body;

    // Vérification de l'utilisateur
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, rows) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la connexion de l'utilisateur",
          });
        }
        if (rows.length === 0) {
          return res.status(401).send({
            error: "L'utilisateur n'existe pas",
          });
        }
        const user = rows[0];
        if (user.role !== role) {
          return res.status(401).send({
            error: "L'utilisateur n'a pas le bon rôle",
          });
        }
        if (role === "medecin" && user.is_verified === 0) {
          return res.status(401).send({
            error: "L'utilisateur n'est pas encore vérifié",
          });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).send({
            error: "Mot de passe incorrect",
          });
        }
        delete user.password;
        const token = jwt.sign(
          { id: user.id, date: Date.now() },
          process.env.JWT_SECRET
        );
        db.query(
          "INSERT INTO tokens (id_user, token) VALUES (?, ?)",
          [user.id, token],
          (err1, result1) => {
            if (err1) {
              return res.status(500).json({
                error: "Erreur lors de la connexion de l'utilisateur",
              });
            }
            // Envoi de la réponse
            return res.send({
              message: "Utilisateur connecté avec succès",
              user,
              token,
            });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la connexion de l'utilisateur",
    });
  }
};

const changePassword = async (req, res) => {
  const id = req.params.id;
  try {
    const { newPassword, type } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Vérification de l'utilisateur
    db.query("SELECT * FROM users WHERE id = ?", [id], async (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la connexion de l'utilisateur",
        });
      }
      if (rows.length === 0) {
        return res.status(401).send({
          error: "L'utilisateur n'existe pas",
        });
      }
      // si c'est un admin je pass "admin", si c'est le medecin lui meme je passe "moi"
      if (type == "admin") {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: rows[0].email,
            subject: "Modification du mot de passe",
            html: `
                <p>Bonjour, ${rows[0].nom},</p>
                <p>Votre mot de passe vient d'être modifié par notre administrateur. Voici votre nouveau mot de passe : <strong>${newPassword}</strong></p>
                <p style="color: #652191; font-size:20px">Centres d'Imagerie Médicale </p>
              <p style="color: #652191; font-size:20px">Radiologie91</p>
              <div><a href="${process.env.FRONT_URL}">${process.env.FRONT_URL}<a/></div>
              `,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send({ error: "Erreur de l'envoi de l'email" });
        }
      }
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, id],
        (err1, result1) => {
          if (err1) {
            return res.status(500).json({
              error:
                "Erreur lors de la modification de mot de passe de l'utilisateur",
            });
          }
          // Envoi de la réponse
          return res.send({
            message: "Modification de mot de passe avec succès",
          });
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la connexion de l'utilisateur",
    });
  }
};
function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const newPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Vérification de l'utilisateur
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, rows) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la connexion de l'utilisateur",
          });
        }
        if (rows.length === 0) {
          return res.status(401).send({
            error: "L'utilisateur n'existe pas",
          });
        }

        if (rows[0].role !== 'medecin') {
          return res.status(401).send({
            error: "Vous ne pouvez pas réinitialiser le mot de passe à cause du role que vous avez",
          });
        }

        try {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Réinitialisation du mot de passe",
            html: `
              <p>Bonjour, ${rows[0].nom},</p>
              <p>Votre mot de passe a été réinitialisé avec succès. Voici votre nouveau mot de passe :  <strong>${newPassword}</strong></p>
              
            <p style="color: #652191; font-size:20px">Centres d'Imagerie Médicale </p>
            <p style="color: #652191; font-size:20px">Radiologie91</p>
            <div><a href="${process.env.FRONT_URL}">${process.env.FRONT_URL}<a/></div>
            `,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send({ error: "Erreur de l'envoi de l'email" });
        }
        db.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashedPassword, rows[0].id],
          (err1, result1) => {
            if (err1) {
              return res.status(500).json({
                error:
                  "Erreur lors de la modification de mot de passe de l'utilisateur",
              });
            }
            // Envoi de la réponse
            return res.send({
              message:
                "Réinitialisation de mot de passe avec succès,Veuillez consulter votre email",
            });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la connexion de l'utilisateur",
    });
  }
};

const getAll = async (req, res) => {
  try {
    // Récupération des utilisateurs
    db.query("SELECT * FROM users", (err, rows) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la récupération des utilisateurs",
        });
      }
      const users = rows.map((user) => {
        delete user.password;
        return user;
      });
      return res.send({
        users,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la récupération des utilisateurs",
    });
  }
};
const getAllType = async (req, res) => {
  try {
    // Récupération des utilisateurs
    db.query(
      "SELECT * FROM users WHERE role = 'radiologue' OR role = 'admin' OR role = 'secretaire'",
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la récupération des utilisateurs",
          });
        }
        const users = rows.map((user) => {
          delete user.password;
          return user;
        });
        return res.send({
          users,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la récupération des utilisateurs",
    });
  }
};

const verifyMedecin = async (req, res) => {
  try {
    const { id } = req.body;
    db.query("UPDATE users SET is_verified = 1 WHERE id = ?", [id], (err) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la vérification de l'utilisateur",
        });
      }
      return res.send({
        message: "Utilisateur vérifié avec succès",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la vérification de l'utilisateur",
    });
  }
};

const checkConnectedUser = async (req, res) => {
  const role = req.params.role;
  // Récupération du token
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    // Récupération de l'utilisateur connecté
    db.query(
      "Select users.* From users, tokens Where users.id = tokens.id_user AND tokens.token = ?",
      [token],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la récupération de l'utilisateur connecté",
          });
        }
        if (rows.length === 0) {
          return res.status(401).send({
            error: "Utilisateur non connecté",
          });
        }

        // Vérification du rôle
        if (rows[0].role !== role) {
          return res.status(401).send({
            error: "L'utilisateur n'a pas le bon rôle",
          });
        }
        return res.send({
          user: rows[0],
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la récupération de l'utilisateur connecté",
    });
  }
};

const logout = async (req, res) => {
  // Récupération du token
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    // Suppression du token
    db.query("DELETE FROM tokens WHERE token = ?", [token], (err) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la déconnexion de l'utilisateur",
        });
      }
      return res.send({
        message: "Utilisateur déconnecté avec succès",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: "Erreur lors de la déconnexion de l'utilisateur",
    });
  }
};

module.exports = {
  create,
  updateOne,
  deleteOne,
  verifyMedecin,
  signup,
  login,
  getAll,
  getAllType,
  checkConnectedUser,
  logout,
  changePassword,
  forgotPassword,
};
