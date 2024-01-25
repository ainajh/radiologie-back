const router = require("express").Router();
const auth = require("../middlewares/authentication");
const demandeController = require("../controllers/demandeController");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: "./upload/files",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
});
router
  .get(
    "/",
    auth(["admin", "radiologue", "secretaire"]),
    demandeController.getAll
  )
  .get("/mine", auth(["medecin"]), demandeController.getMine)
  .put(
    "/update",
    auth(["admin", "radiologue", "secretaire"]),
    demandeController.changeStatus
  )
  .put("/update/info", auth(["admin", "radiologue", "secretaire"]), demandeController.updateInfo)
  .post("/sendcode", demandeController.sendCodeConfirmation)
  .delete(
    "/delete/:id",
    auth(["admin", "radiologue", "secretaire", "medecin"]),
    demandeController.deleteOne
  )
  .post("/add", upload.single("ordonnance"), demandeController.create)
  .delete("/delete/email/:token", demandeController.deleteMine)
  .get("/statistique", auth(["admin"]), demandeController.getStats)
  .get("/statistique/med", auth(["admin"]), demandeController.getStatsMed)
  .post(
    "/comment",
    auth(["admin", "radiologue", "secretaire"]),
    demandeController.addComment
  )
  .delete('/comment/:id', auth(['admin', 'radiologue', 'secretaire']), demandeController.deleteComment)

module.exports = router;
