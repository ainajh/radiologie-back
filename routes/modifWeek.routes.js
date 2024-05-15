const router = require("express").Router();
const auth = require("../middlewares/authentication");
const modifWeek = require("../controllers/modifWeek.controller");

router
  // .get("/", modifWeek.getAll);
  .post("/add", auth(["admin"]), modifWeek.create);
//   .put("/update", auth(["admin"]), modifWeek.updateOne)
//   .delete("/delete/:id", auth(["admin"]), modifWeek.deleteOne);

module.exports = router;
