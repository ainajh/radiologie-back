const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authentication");

router
  .get(
    "/",
    // auth(["admin", "medecin", "radiologue", "secretaire"]),
    userController.getAll
  )
  .get(
    "/all",
    auth(["admin", "radiologue", "secretaire"]),
    userController.getAllType
  )
  .post("/add", auth(["admin"]), userController.create)
  .post("/signup", userController.signup)
  .post("/verify", auth(["admin"]), userController.verifyMedecin)
  .put("/update", auth(["admin", "medecin"]), userController.updateOne)
  .put(
    "/change-pass/:id",
    auth(["admin", "medecin"]),
    userController.changePassword
  )
  .post("/forgot-pass", userController.forgotPassword)
  .delete("/delete/:id", auth(["admin"]), userController.deleteOne)
  .post(
    "/logout",
    auth(["admin", "radiologue", "secretaire", "medecin"]),
    userController.logout
  )
  .post("/login/:role", userController.login)
  .get("/check/:role", userController.checkConnectedUser);

module.exports = router;
