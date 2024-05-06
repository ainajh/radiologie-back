const router = require("express").Router();
const leaveController = require("../controllers/leave-controller");

router
  .get("/", leaveController.getAll)
  .get("/:idUser", leaveController.getMyLeave)
  .get("/leaveOfPerson/:personId", leaveController.getOne)
  .post("/add", leaveController.create)
  .post("/", leaveController.getAllInTwoDate)
  .put("/update/:leaveId", leaveController.updateOne)
  .post("/isDisponible", leaveController.isDisponible)
  .delete("/delete/:leaveId", leaveController.deleteOne);

module.exports = router;
