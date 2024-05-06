const router = require("express").Router();
const auth = require("../middlewares/authentication");
const commController = require("../controllers/commentSchedule.controller");

router
  .post("/", auth(["admin", "medecin", "radiologue", "secretaire"]), commController.getAll)
  .post("/add", auth(["admin", "medecin", "radiologue", "secretaire"]), commController.create);
//   .put("/update", auth(["admin", "medecin", "radiologue", "secretaire"]), commController.updateOne)
//   .delete("/delete/:id", auth(["admin", "medecin", "radiologue", "secretaire"]), commController.deleteOne);

module.exports = router;
