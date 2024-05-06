const router = require("express").Router();
const auth = require("../middlewares/authentication");
const placeController = require("../controllers/placeController");

router
  .get("/", placeController.getAll)
  .post("/add", auth(["admin"]), placeController.create)
  .put("/update", auth(["admin"]), placeController.updateOne)
  .delete("/delete/:id", auth(["admin"]), placeController.deleteOne);

module.exports = router;
