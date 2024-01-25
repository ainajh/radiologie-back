const router = require("express").Router();
const auth = require("../middlewares/authentication");
const typeController = require("../controllers/typeController");

router
  .get("/", typeController.getAll)
  .post("/add", auth(["admin"]), typeController.create)
  .put("/update", auth(["admin"]), typeController.updateOne)
  .delete("/delete/:id", auth(["admin"]), typeController.deleteOne);

module.exports = router;
