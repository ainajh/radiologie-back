const router = require("express").Router();
const scheduleController = require("../controllers/schedule-controller");

router
  .get("/", scheduleController.getAll)
  .get("/undoCopyPaste/:copiedId", scheduleController.undoCopyPaste)
  .post("/add", scheduleController.create)
  .post("/copypaste", scheduleController.copyPaste)
  .put("/update/:id", scheduleController.updateOne)
  .delete("/delete/:id", scheduleController.deleteOne);

module.exports = router;
