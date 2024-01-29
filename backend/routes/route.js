const authController = require("../controllers/authController");
const noteController = require("../controllers/notesController");

const router = require("express").Router();

//Split into 2 files
//explore using put
//explore :id as param?

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/notes", authController.protect, noteController.getNotes);
router.get(
  "/versionHistory",
  authController.protect,
  noteController.getVersionHistory
);
router.post("/note", authController.protect, noteController.createNote);
router.delete(
  "/note/:noteId",
  authController.protect,
  noteController.deleteNote
);
router.put("/note", authController.protect, noteController.updateNote);

module.exports = router;
