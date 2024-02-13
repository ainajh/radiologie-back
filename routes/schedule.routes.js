const router = require("express").Router();
const scheduleController = require("../controllers/schedule-controller");

router
  .get("/", scheduleController.getAll)
  .post("/add", scheduleController.create)
  .put("/update/:id", scheduleController.updateOne)
  .delete("/delete/:id", scheduleController.deleteOne);

module.exports = router;