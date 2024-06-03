const router = require("express").Router();
const scheduleController = require("../controllers/schedule-controller");
const commentaire = require("../controllers/commentSchedule.controller");

router
  .get("/", scheduleController.getAll)
  .post("/getAllSheduleThisWeek", scheduleController.getAllSheduleThisWeek)
  .post("/deleteAllSheduleThisWeek", scheduleController.deleteAllSheduleThisWeek)
  .get("/undoCopyPaste/:copiedId", scheduleController.undoCopyPaste)
  .post("/add", scheduleController.create)
  .put("/toogleValidationPlanning/:id", scheduleController.toogleValidationPlanning)
  .post("/copypaste", scheduleController.copyPaste)
  .put("/update/:id", scheduleController.updateOne)
  .delete("/delete/:id", scheduleController.deleteOne)
  .post("/statistique", commentaire.statistique);

module.exports = router;
