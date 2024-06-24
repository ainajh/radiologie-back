const router = require("express").Router();
const auth = require("../middlewares/authentication");
const placeController = require("../controllers/placeController");

router
  .get("/", placeController.getAll)
  .post(
    "/add",
    // auth(["admin"]),
    placeController.create
  )
  .put(
    "/:id",
    // auth(["admin"]),
    placeController.updateOne
  )
  .put(
    "/uptathis/:id",
    // auth(["admin"]),
    placeController.updateAthis
  )
  .delete("/delete/:id", auth(["admin"]), placeController.deleteOne);

module.exports = router;
