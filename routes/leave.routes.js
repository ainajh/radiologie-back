const router = require("express").Router();
const leaveController = require("../controllers/leave-controller");
const auth = require("../middlewares/authentication");

router
  .get("/", leaveController.getAll)
  .get("/:idUser", leaveController.getMyLeave)
  .get("/leaveOfPerson/:personId", leaveController.getOne)
  .post("/add", auth(["admin", "radiologue", "secretaire"]), leaveController.create)
  .post("/", leaveController.getAllInTwoDate)
  .put("/update/:leaveId", leaveController.updateOne)
  .post("/isDisponible", leaveController.isDisponible)
  .delete("/delete/:leaveId", leaveController.deleteOne);

module.exports = router;
